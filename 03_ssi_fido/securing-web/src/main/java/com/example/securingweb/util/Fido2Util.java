package com.example.securingweb.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
public final class Fido2Util {
   private static final String COOKIE_NAME = "fido2-session-id";
   
   public static final Companion Companion = new Companion();

   public static enum Auth {
      AUTHENTICATED_PASSWORD  ("authenticated-password"),
	  PRE_AUTHENTICATE_FIDO ("pre-authenticate-fido"),
	  AUTHENTICATED_FIDO ("authenticated-fido");

      private final String value;

      public final String getValue() {
         return this.value;
      }

      private Auth(String value) {
         this.value = value;
      }
      
   }

   public static enum Role {
      USER("ROLE_USER");

      
      private final String value;

      
      public final String getValue() {
         return this.value;
      }

      private Role(String value) {
         this.value = value;
      }
   }

   public static final class Companion {
      public final void setFido2SessionId( String sessionId,  HttpServletResponse httpServletResponse) {
         Cookie cookie = new Cookie(COOKIE_NAME, sessionId);
         cookie.setPath("/");
         httpServletResponse.addCookie(cookie);
      }

      
      public final String getFido2SessionId( HttpServletRequest httpServletRequest) {
         Cookie[] cookies = httpServletRequest.getCookies();
         if (cookies != null && cookies.length != 0) {
            String sessionId = "";

            for(int i = 0; i < cookies.length; ++i) {
               Cookie cookie = cookies[i];
               if (cookie.getName().equals(COOKIE_NAME)) {
            	   sessionId = cookie.getValue();
            	   break;
               }
            }

            return sessionId;
         } else {
            return "";
         }
      }

      public final User getLoginUser() {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return principal instanceof User ? (User)principal : null;
      }


      public Companion() {
      }
   }
}
