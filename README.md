使用CapserJS对 JY5 进行模块功能测试
-------------

module文件夹下放置各模块的测试用例，测试用例依赖于 config.js, init.js, utils.js, login.js.


命令：

<pre><code> casperjs test modules/mbox.js --includes=config.js,init.js,utils.js,login.js </code></pre>



#### 收件箱功能点：

* 基本列表（工具栏等）
* 删除/撤销
* 举报/撤销
* 标记为未读/已读
* 标记为星标/取消星标
* 移动到
* 移动到 -> 新建分类