package com.example.securingweb.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.securingweb.dto.UserRequest;
import com.example.securingweb.entity.LoginUser;
import com.example.securingweb.service.Status;
import com.example.securingweb.service.UserService;
import com.example.securingweb.util.InputChkUtil;
import com.example.securingweb.util.SignatureUtil;
/**
 * ユーザー情報 Controller
 */
@Controller
public class UserController {

	/**
	 * ユーザー情報 Service
	 */
	@Autowired
	UserService userService;

	@Autowired
	NamedParameterJdbcTemplate jdbcTemplate;
	
	// 画面入力最大値設定
	final int userMaxLength = 200;
	
	/**
	 * ログイン画面を表示
	 * @param model Model
	 * @return ログイン画面
	 */
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(Model model,
			@RequestParam(name = "user", value = "user", defaultValue="", required = false) String user,
			@RequestParam(name = "token", value = "token",defaultValue="", required = false) String token,
			@RequestParam(name = "url", value = "url",defaultValue="", required = true) String url) {

		// 送信データにuserが含まれていた場合、画面入力値に設定
		if(user != "") {
			if(user.length() > userMaxLength) {
				user = user.substring(0,userMaxLength);
			}
			model.addAttribute("userid", user);
		}

		if(!token.equals("")) {
			String status = SignatureUtil.checkToken(token,model,userMaxLength);
	
			// チェック結果がOK以外の場合はエラーを返却
			if(!status.equals(Status.OK.getValue())) {
	
				System.out.println("error_message : " + status);
				System.out.println("token : " + new SignatureUtil().crateTokenFido("test"));
				model.addAttribute("error_message", status);
				return "error";
			}
		}
		model.addAttribute("redirectURL", url);
		
		return "login";
	}

	@RequestMapping(value = "/pwlogin", method = RequestMethod.POST)
	public String Authlogin(@ModelAttribute UserRequest userRequest,Model model, 
			@RequestParam(name = "redirectURL", value = "redirectURL", required = true) String url) {

		boolean status = userService.login(userRequest,jdbcTemplate);

		if(!status) {

			System.out.println("token : " + new SignatureUtil().crateTokenFido("test"));
			model.addAttribute("redirectURL", url);
			model.addAttribute("userid", userRequest.getName());
			model.addAttribute("errorMessage", "ログインエラー");
			return "login";
		}


		return "redirect:"+ url+"?token="+new SignatureUtil().crateTokenPW(userRequest.getName());
	}
	
	/**
	 * ユーザー情報一覧画面を表示
	 * @param model Model
	 * @return ユーザー情報一覧画面
	 */
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public String displayList(Model model) {
		List<LoginUser> userlist = userService.searchAll();
		model.addAttribute("userlist", userlist);
		return "list";
	}
	
	/**
	 * ユーザー新規登録画面を表示
	 * @param model Model
	 * @return ユーザー情報一覧画面
	 */
	@RequestMapping(value = "/add", method = RequestMethod.GET)
	public String displayAdd(Model model,

			@RequestParam(name = "token", value = "token",defaultValue="", required = false) String token,
			@RequestParam(name = "url", value = "url",defaultValue="", required = true) String url) {

		if(!token.equals("")) {
			String status = SignatureUtil.checkToken(token,model,userMaxLength);
	
			// チェック結果がOK以外の場合はエラーを返却
			if(!status.equals(Status.OK.getValue())) {
	
				System.out.println("error_message : " + status);
				System.out.println("token : " + new SignatureUtil().crateTokenFido("test"));
				model.addAttribute("error_message", status);
				return "error";
			}
		}

		model.addAttribute("userRequest", new UserRequest());
		return "add";
	}
	/**
	 * ユーザー新規登録
	 * @param userRequest リクエストデータ
	 * @param model Model
	 * @return ユーザー情報一覧画面
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	public String create(
			@ModelAttribute UserRequest userRequest, Model model
			,@RequestParam(name = "redirectURL", value = "redirectURL",defaultValue="", required = true) String url) {

		String chkMsg = InputChkUtil.chkUserCreate(userRequest,jdbcTemplate);
		
		// 入力チェック
		if(chkMsg != null) {
			model.addAttribute("errorMessage", chkMsg);
			model.addAttribute("redirectURL", url);
			model.addAttribute("userid", userRequest.getName());
			return "login";
		}
		
		userService.create(userRequest);

		String token = new SignatureUtil().crateTokenPW(userRequest.getName());

		System.out.println("token : " + token);
		model.addAttribute("token", token);
		return "ok";
	}

	@RequestMapping({"login-redirect"})
	public String loginRedirect(@ModelAttribute UserRequest userRequest,@RequestParam(name = "redirectURL", value = "redirectURL", required = true) String url) {
		return "redirect:"+ url+"?token="+new SignatureUtil().crateTokenFido(userRequest.getName());
	}

	@GetMapping({"ok"})
	public String ok( Model model) {
		return "ok";
	}

}