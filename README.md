Automated Test For JY5 @ Netease
-------------

目录结构：

* const		xpath, selector 等常量
* core		全局设置( useragent, 用户信息, 全局事件等 )
* test   	各模块的测试用例
* utils 	各模块需要用到的Util
* screenshot 默认的截图路径


命令：

<pre><code> sh run.sh </code></pre>


支持参数：

* -o xunit.xml  输出 xUnit XML，方便Jenkins等导入；



#### 收件箱功能点：

* 基本列表（工具栏等）
* 删除/撤销
* 举报/撤销
* 标记为未读/已读
* 标记为星标/取消星标
* 移动到
* 移动到 -> 新建分类


#### 读信功能点：

* 工具栏
* 信件内容
* 快捷回复
* 删除
* 移动到
* 回复 / 转发
* 转发