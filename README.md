简约5.0功能测试
-------------


### 安装

* Windows
	- 安装capserjs github master版本

		下载 [casperjs](https://github.com/n1k0/casperjs/zipball/master) 解压，将capserjs/batchbin加入系统PATH
	- 安装phantomjs
			
		下载 [phantomjs](https://phantomjs.googlecode.com/files/phantomjs-1.9.1-windows.zip) 解压，将phantomjs路径加入系统PATH

* Mac
	1. 安装 [HomeBrew](https://github.com/mxcl/homebrew/wiki/installation)

		<pre><code>ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"</code></pre>
	2. 安装 phantom
	
		<pre><code>brew update && brew install phantomjs</code></pre>		
	3.  安装 casperjs
		
		<pre><code>$ git clone git://github.com/n1k0/casperjs.git
		$ cd casperjs
		$ git checkout master
		$ ln -sf `pwd`/bin/casperjs /usr/local/bin/casperjs
		</code></pre>

### 目录结构


* const		xpath, selector 等常量
* core		全局设置( useragent, 用户信息, 全局事件等 )
* modules   	各模块的测试用例
* utils 	各模块需要用到的Util
* screenshot 默认的截图路径


### 运行方法

<pre><code> sh run.sh </code></pre>


支持参数：

* -o xunit.xml  输出 xUnit XML，方便Jenkins等导入；



### 相关链接

* [casperjs github](https://github.com/n1k0/casperjs)
* [phantomJS](http://phantomjs.org/)


### 测试功能点

###### 收件箱功能点：

* 基本列表（工具栏等）
* 删除/撤销
* 举报/撤销
* 标记为未读/已读
* 标记为星标/取消星标
* 移动到
* 移动到 -> 新建分类


###### 读信功能点：

* 工具栏
* 信件内容
* 快捷回复
* 删除
* 移动到
* 回复 / 转发
* 转发