import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface AuthProviderProps {
	children: ReactNode;
}

interface UserProps {
	name: string;
	avatarUrl: string;
}

export interface AuthContextDataProps {
	user: UserProps;
	isUserLoading: boolean;
	signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps>({} as UserProps);
	const [isUserLoading, setIsUserLoading] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId:
			"226558425167-1g2jhvjil2mnp659bvm23tg54h8vgpn2.apps.googleusercontent.com",
		redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
		scopes: ["profile", "email"],
	});

	async function signIn() {
		try {
			setIsUserLoading(true);
			await promptAsync();
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			setIsUserLoading(false);
		}
	}

	async function signWithGoogle(accessToken: string) {
		try {
			setIsUserLoading(true);

			const tokenResponse = await api.post("/users", { accessToken });
			api.defaults.headers.common[
				"Authorization"
			] = `Bearer ${tokenResponse.data.token}`;

			const userInforesponse = await api.get("/me");
			setUser(userInforesponse.data.user);
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			setIsUserLoading(false);
		}
	}

	useEffect(() => {
		if (
			response?.type === "success" &&
			response.authentication?.accessToken
		) {
			signWithGoogle(response.authentication.accessToken);
		}
	}, [response]);

	return (
		<AuthContext.Provider
			value={{
				signIn,
				isUserLoading,
				user,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
