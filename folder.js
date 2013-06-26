/**
 * 测试帐号的文件夹命名规则，以便对应到测试用例
 * @type {Object}
 */
var $Folder = {
	"normal": {
		name: "【可写】供移动测试",
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"draft": {
		name: "草稿箱",
		check: [  $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"pop": {
		name: "em91beta@163.com",
		check: [ $XPATH.TOOLBAR_POPICON, $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_POPICON, $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"empty": {
		name: "【只读】 空文件夹",
		check: [],
		none: [],
		always: [ $XPATH.LIST_EMPTY ]
	},

	"unread": {
		name: "【只读】 未读文件夹"	,
		check: [],
		none: [],
		always: []
	},

	"onepage": {
		name: "【只读】一页邮件",
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ],
		notexist: [ $XPATH.PAGER_BOTTOM ]
	},

	"read": {
		name: "【只读】读信测试",
		check: [],
		always: [],
		none: [],
		notexist: []
	}
}