
/**
 * 通用的选择器枚举
 * @type {Object}
 */
var $SELECTOR = {};
$SELECTOR.LOGIN_PAGE_FORM = "form#login163";
$SELECTOR.LOGIN_OK_BTN = "#loginBtn";
$SELECTOR.MBOXNAV_FOLDER_1 = '#folder_1 .js-label';


/**
 * 通用的xpath枚举
 * @type {Object}
 */
var $XPATH = {};
$XPATH.LIST_CONTAINER_EXIST = $Utils.getModuleXpath('//div[contains(@class, "js-list-container")]');
$XPATH.TOOLBAR_MARK_BUTTON = $Utils.getToolbarXpath( '/div[contains(.,"标记为")]/div' );
$XPATH.TOOLBAR_MOVETO_BUTTON = $Utils.getToolbarXpath( '//div[contains(@class, "w-button-dd")][contains(.,"移动到")]/div' );
$XPATH.TOOLBAR_MARK_READ_UNREAD_MENU = $Utils.getToolbarDropMenu( '/div/div[1]' );
$XPATH.TOOLBAR_MARK_STAR_UNSTAR_MENU = $Utils.getToolbarDropMenu( '/div/div[2]' );
$XPATH.TOOLBAR_MOVETO_FOLDER_2_MENU = $Utils.getToolbarDropMenu( '/div/div[2]' );
$XPATH.TOOLBAR_REPORT_BUTTON = $Utils.getToolbarXpath( '//div[contains(@class, "w-button-txt")][contains(., "举报")]/div' );
$XPATH.TOOLBAR_DELETE_BUTTON = $Utils.getToolbarXpath( '//div[contains(@class, "w-button-txt")][contains(., "删除")]/div' );
$XPATH.TOOLBAR_MORE_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "更多")]/div' );
$XPATH.TOOLBAR_CALENDAR = $Utils.getToolbarXpath( '//a[contains(@class, "js-datepicker")]' );
$XPATH.TOOLBAR_PAGER = $Utils.getToolbarXpath( '/div[@class="page js-widget"]' );
$XPATH.TOOLBAR_PAGER_NEXT = $Utils.getToolbarXpath( '/div[@class="m-page f-fr"]' );
$XPATH.TOOLBAR_POPICON = $Utils.getToolbarXpath( '/a[@class="w-icon-skin  ico-i i js-widget"]' );
$XPATH.LIST_EMPTY = $Utils.getModuleXpath( '//div[@class="m-emp-tlst"]' );
$XPATH.TOOLBAR_GUIDE = $Utils.getToolbarXpath( '/div[contains(@class, "guide")]');
$XPATH.PAGER_BOTTOM = $Utils.getModuleXpath( '//div[@class="p-mx-pagectrl"]//div[contains(@class,"js-cmds")]/div[not(@style)]' );
$XPATH.TOOLBAR_BACK_BUTTON = $Utils.getToolbarXpath( '/div[contains(.,"<<")]' );
$XPATH.TOOLBAR_FORWARD_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "转发")]/div' );
$XPATH.TOOLBAR_REPLY_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "回复")]/div' );
$XPATH.TOOLBAR_REPLYALL_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "回复全部")]/div' );
$XPATH.READ_QUICKREPLY = $Utils.getModuleXpath( "//div[contains(@class, 'js-quickReply')][@style='']" );


/**
 * 测试帐号的文件夹命名规则，以便对应到测试用例
 * @type {Object}
 */
var $Folder = {
	"inbox": {
		name: "收件箱",
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

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
		name: "【只读】 未读文件夹",
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