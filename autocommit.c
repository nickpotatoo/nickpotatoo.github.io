#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define CONFIG_FILE "autocommit.conf"
#define MAX_PATHS 64
#define MAX_LINE 512
#define MAX_CMD 8192

static void trim_newline(char *s) {
    size_t len = strlen(s);
    while (len > 0 && (s[len - 1] == '\n' || s[len - 1] == '\r')) {
        s[--len] = '\0';
    }
}

int main(void) {
    FILE *fp = fopen(CONFIG_FILE, "r");
    if (!fp) {
        fprintf(stderr, "错误: 无法打开配置文件 %s\n", CONFIG_FILE);
        fprintf(stderr, "请确保在博客根目录下运行本工具，且 %s 存在。\n", CONFIG_FILE);
        return 1;
    }

    char paths[MAX_PATHS][MAX_LINE];
    int path_count = 0;
    char line[MAX_LINE];

    while (fgets(line, sizeof(line), fp) && path_count < MAX_PATHS) {
        trim_newline(line);
        if (line[0] == '\0' || line[0] == '#') continue;
        strcpy(paths[path_count++], line);
    }
    fclose(fp);

    if (path_count == 0) {
        printf("配置文件中没有待追踪路径，无需操作。\n");
        return 0;
    }

    /* Build git add command */
    char cmd[MAX_CMD];
    snprintf(cmd, sizeof(cmd), "git add");
    for (int i = 0; i < path_count; i++) {
        size_t remaining = sizeof(cmd) - strlen(cmd) - 1;
        if (strlen(paths[i]) + 2 > remaining) {
            fprintf(stderr, "错误: 命令过长，请减少配置路径数量。\n");
            return 1;
        }
        strcat(cmd, " \"");
        strcat(cmd, paths[i]);
        strcat(cmd, "\"");
    }

    printf("[1/3] 添加文件到暂存区...\n");
    printf("      执行: %s\n", cmd);
    int ret = system(cmd);
    if (ret != 0) {
        fprintf(stderr, "警告: git add 返回非零状态码 %d\n", ret);
    }

    /* Generate timestamp commit message */
    time_t now = time(NULL);
    struct tm *t = localtime(&now);
    char msg[256];
    strftime(msg, sizeof(msg), "%Y-%m-%d-%H-%M-%S-进行了内容更新", t);

    /* Git commit */
    char commit_cmd[MAX_CMD];
    snprintf(commit_cmd, sizeof(commit_cmd), "git commit -m \"%s\"", msg);
    printf("[2/3] 提交更改...\n");
    printf("      提交信息: %s\n", msg);
    ret = system(commit_cmd);
    if (ret != 0) {
        printf("提示: git commit 返回非零状态码（可能没有需要提交的更改）\n");
    }

    /* Git push */
    printf("[3/3] 推送到远程仓库...\n");
    ret = system("git push");
    if (ret != 0) {
        fprintf(stderr, "错误: git push 失败，请检查网络连接和远程仓库配置。\n");
        return 1;
    }

    printf("\n全部完成！已将内容更新推送至 GitHub。\n");
    return 0;
}
