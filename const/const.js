
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
$XPATH.READ_QUICKREPLY_TEXTAREA = $Utils.getModuleXpath( "//div[contains(@class, 'js-quickReply')][@style='']//textarea" );
$XPATH.READ_QUICKREPLY_BUTTONS = $Utils.getModuleXpath( "//div[contains(@class, 'js-quickReply')][@style='']//div[contains(@class,'js-quickBtns')][@style!='display: none;']" );
$XPATH.READ_QUICKREPLY_BUTTON_OK = $Utils.getModuleXpath( "//div[contains(@class, 'js-quickReply')][@style='']//div[contains(@class,'js-quickBtns')][@style!='display: none;']/div[contains(@class,'w-btn-submit')]" );
$XPATH.READ_IFRAME = $Utils.getModuleXpath( "//iframe" );
$XPATH.READ_SIMPLE_SENDER = $Utils.getModuleXpath( "//a[contains(@class, 'js-sender')]" );
$XPATH.READ_HOVERMENU_TRIGGER = $Utils.getModuleXpath( "//div[contains(@class, 'js-clickbar')]" );
$XPATH.READ_MODE_FULL = $Utils.getModuleXpath( "//a[contains(@class,'js-toggle-view-type')][contains(., '完整信息')]" );
$XPATH.READ_MODE_SIMPLE = $Utils.getModuleXpath( "//a[contains(@class,'js-toggle-view-type')][contains(., '精简信息')]" );
$XPATH.READ_MODE_INFO_FULL = $Utils.getModuleXpath( "//div[@class='js-full'][not(contains(@style,'display: none;'))]" );
$XPATH.READ_MODE_INFO_SIMPLE = $Utils.getModuleXpath( "//div[@class='js-simple'][not(contains(@style,'display: none;'))]" );


/**
 * 测试帐号的文件夹命名规则，以便对应到测试用例
 * @type {Object}
 */
var $Folder = {
	"inbox": {
		id: "",
		name: "收件箱",
		system: true,
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"normal": {
		id: "",
		name: "【可写】供移动测试",
		system: false,
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"draft": {
		id: "",
		name: "草稿箱",
		system: true,
		check: [  $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	// "pop": {
	// 	name: "em91beta@163.com",
	// 	system: false,
	// 	check: [ $XPATH.TOOLBAR_POPICON, $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
	// 	always: [ $XPATH.TOOLBAR_POPICON, $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
	// 	none: [ $XPATH.TOOLBAR_GUIDE ]
	// },

	"empty": {
		id: "",
		system: false,
		name: "【只读】 空文件夹",
		check: [],
		none: [],
		always: [ $XPATH.LIST_EMPTY ]
	},

	"unread": {
		id: "",
		system: false,
		name: "【只读】 未读文件夹",
		check: [],
		none: [],
		always: []
	},

	"onepage": {
		id: "",
		system: false,
		name: "【只读】一页邮件",
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ],
		notexist: [ $XPATH.PAGER_BOTTOM ]
	}
}