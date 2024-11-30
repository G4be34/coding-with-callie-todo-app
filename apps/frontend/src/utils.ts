import { jwtDecode } from "jwt-decode";
import { redirect } from "react-router-dom";

type DecodedToken = {
  exp: number;
};

export class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export const validateToken = ({ request }: { request: Request }) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const { access_token } = JSON.parse(token);
      const decoded: DecodedToken = jwtDecode(access_token);

      // Check if the token is expired
      if (decoded.exp * 1000 < Date.now()) {
        const redirectUrl = new URL(request.url).pathname;
        sessionStorage.setItem("redirect_after_login", redirectUrl);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        return null;
      }

      return { access_token };
    } catch (error) {
      const redirectUrl = new URL(request.url).pathname;
      sessionStorage.setItem("redirect_after_login", redirectUrl);
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      console.error("Token validation error:", error.message);
      return null;
    }
  } else {
    sessionStorage.setItem("redirect_after_login", new URL(request.url).pathname);
    throw redirect("/login"); // Handle cases where no token exists
  }
};
