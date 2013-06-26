
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
$XPATH.TOOLBAR_MARK_BUTTON = $Utils.getToolbarXpath( '/div[contains(.,"标记为")]' );
$XPATH.TOOLBAR_MOVETO_BUTTON = $Utils.getToolbarXpath( '/div[contains(.,"移动到")]' );
$XPATH.TOOLBAR_MARK_READ_UNREAD_MENU = $Utils.getToolbarDropMenu( '/div/div[1]' );
$XPATH.TOOLBAR_MARK_STAR_UNSTAR_MENU = $Utils.getToolbarDropMenu( '/div/div[2]' );
$XPATH.TOOLBAR_MOVETO_FOLDER_2_MENU = $Utils.getToolbarDropMenu( '/div/div[2]' );
$XPATH.TOOLBAR_REPORT_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "举报")]' );
$XPATH.TOOLBAR_DELETE_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "删除")]' );
$XPATH.TOOLBAR_MORE_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "更多")]' );
$XPATH.TOOLBAR_CALENDAR = $Utils.getToolbarXpath( '//a[contains(@class, "js-datepicker")]' );
$XPATH.TOOLBAR_PAGER = $Utils.getToolbarXpath( '/div[@class="page js-widget"]' );
$XPATH.TOOLBAR_PAGER_NEXT = $Utils.getToolbarXpath( '/div[@class="m-page f-fr"]' );
$XPATH.TOOLBAR_POPICON = $Utils.getToolbarXpath( '/a[@class="w-icon-skin  ico-i i js-widget"]' );
$XPATH.LIST_EMPTY = $Utils.getModuleXpath( '//div[@class="m-emp-tlst"]' );
$XPATH.TOOLBAR_GUIDE = $Utils.getToolbarXpath( '/div[contains(@class, "guide")]');
$XPATH.PAGER_BOTTOM = $Utils.getModuleXpath( '//div[@class="p-mx-pagectrl"]//div[contains(@class,"js-cmds")]/div[not(@style)]' );
