import { k as createComponent, l as renderTemplate, n as addAttribute, p as renderHead, q as renderComponent, t as renderSlot, o as createAstro, m as maybeRenderHead, u as unescapeHTML } from './astro/server_DmkGNxfy.mjs';
import 'kleur/colors';
import 'html-escaper';
import toast, { Toaster } from 'react-hot-toast';
/* empty css                         */
import { jsxs, jsx } from 'react/jsx-runtime';
import axios from 'axios';
import useSWR, { useSWRConfig } from 'swr';
import { RiHandCoinLine } from 'react-icons/ri';
import { LuCopy } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import 'clsx';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderComponent($$result, "Toaster", Toaster, { "client:idle": true, "toastOptions": {
    style: {
      fontSize: "0.85rem"
    }
  }, "client:component-hydration": "idle", "client:component-path": "react-hot-toast", "client:component-export": "Toaster" })} ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/internetdrew/dev/projects/hackers-the-api/client/src/layouts/Layout.astro", void 0);

const PersonalizedGreeting = ({
  username,
  accessToken
}) => {
  const copyAccessToken = () => {
    navigator.clipboard.writeText(accessToken).then(() => {
      toast.success("Access token copied to clipboard!");
    }).catch((_err) => {
      toast.error("Failed to copy access token.");
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "personalized-welcome", children: [
    /* @__PURE__ */ jsxs("p", { className: "greeting", children: [
      /* @__PURE__ */ jsxs("strong", { children: [
        "Welcome, ",
        /* @__PURE__ */ jsx("span", { className: "username", children: username })
      ] }),
      "!"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "input-control", children: [
      /* @__PURE__ */ jsx("label", { id: "token-label", htmlFor: "accessToken", children: /* @__PURE__ */ jsx("strong", { children: "Access token" }) }),
      /* @__PURE__ */ jsxs("div", { className: "token-input-container", children: [
        /* @__PURE__ */ jsx(RiHandCoinLine, {}),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "accessToken",
            className: "token-display",
            type: "password",
            value: accessToken,
            disabled: true
          }
        ),
        /* @__PURE__ */ jsx("button", { onClick: copyAccessToken, children: /* @__PURE__ */ jsx(LuCopy, {}) })
      ] })
    ] })
  ] });
};

const loginUserSchema = z.object({
  username: z.string().min(3, { message: "Please enter your username." }),
  password: z.string().min(1, { message: "Please enter your password." }),
  passwordConfirmation: z.string().min(1, {
    message: "Please confirm your password."
  })
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match.",
  path: ["passwordConfirmation"]
});
const LoginForm = ({
  setActiveForm
}) => {
  const { mutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginUserSchema)
  });
  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${"http://localhost:3000"}/login`,
        {
          username: data.username,
          password: data.password
        },
        {
          withCredentials: true
        }
      );
      mutate(`${"http://localhost:3000"}/check-auth`);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleFormSwap = () => setActiveForm("register");
  return /* @__PURE__ */ jsxs("div", { className: "form-container", children: [
    /* @__PURE__ */ jsx("span", { className: "form-title", children: "Login" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
      /* @__PURE__ */ jsxs("div", { className: "formControl", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "username", children: "Username" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "username",
            type: "text",
            placeholder: "Enter a username",
            ...register("username"),
            "aria-invalid": errors.username ? "true" : "false"
          }
        ),
        errors.username?.message && /* @__PURE__ */ jsx("small", { children: errors.username.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "formControl", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            type: "password",
            placeholder: "Enter a password",
            ...register("password"),
            "aria-invalid": errors.password ? "true" : "false"
          }
        ),
        errors.password?.message && /* @__PURE__ */ jsx("small", { children: errors.password.message })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "submit-btn", children: "Login" })
    ] }),
    /* @__PURE__ */ jsx("small", { className: "or", children: "Don't have an account yet?" }),
    /* @__PURE__ */ jsx("button", { onClick: handleFormSwap, children: "Register" })
  ] });
};

const registerUserSchema = z.object({
  username: z.string().min(3, { message: "Please enter a username." }),
  password: z.string().min(1, { message: "Please enter a password." }),
  passwordConfirmation: z.string().min(1, {
    message: "Please confirm your password."
  })
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match.",
  path: ["passwordConfirmation"]
});
const RegisterForm = ({
  setActiveForm
}) => {
  const { mutate } = useSWRConfig();
  const [errorOnPost, setErrorOnPost] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful }
  } = useForm({
    resolver: zodResolver(registerUserSchema)
  });
  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${"http://localhost:3000"}/user`,
        {
          username: data.username,
          password: data.password
        },
        {
          withCredentials: true
        }
      );
      setErrorOnPost(false);
      mutate(`${"http://localhost:3000"}/check-auth`);
    } catch (error) {
      setErrorOnPost(true);
      if (error.response?.status === 409) {
        toast.error("This user already exists. Try another username.");
      }
    }
  };
  useEffect(() => {
    if (!errorOnPost) {
      reset();
    }
  }, [isSubmitSuccessful, errorOnPost]);
  const handleFormSwap = () => setActiveForm("login");
  return /* @__PURE__ */ jsxs("div", { className: "form-container", children: [
    /* @__PURE__ */ jsx("span", { className: "form-title", children: "Create an account" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
      /* @__PURE__ */ jsxs("div", { className: "formControl", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "username", children: "Username" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "username",
            type: "text",
            placeholder: "Enter a username",
            ...register("username"),
            "aria-invalid": errors.username ? "true" : "false"
          }
        ),
        errors.username?.message && /* @__PURE__ */ jsx("small", { children: errors.username.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "formControl", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "password",
            type: "password",
            placeholder: "Enter a password",
            ...register("password"),
            "aria-invalid": errors.password ? "true" : "false"
          }
        ),
        errors.password?.message && /* @__PURE__ */ jsx("small", { children: errors.password.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "formControl", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "passwordConfirmation", children: "Confirm Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "passwordConfirmation",
            type: "password",
            placeholder: "Confirm password",
            ...register("passwordConfirmation"),
            "aria-invalid": errors.passwordConfirmation ? "true" : "false"
          }
        ),
        errors.passwordConfirmation?.message && /* @__PURE__ */ jsx("small", { children: errors.passwordConfirmation.message })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "submit-btn", children: "Register" })
    ] }),
    /* @__PURE__ */ jsx("small", { className: "or", children: "Already have an account?" }),
    /* @__PURE__ */ jsx("button", { onClick: handleFormSwap, children: "Login" })
  ] });
};

const Forms = () => {
  const [activeForm, setActiveForm] = useState(
    "register"
  );
  return /* @__PURE__ */ jsx("div", { className: "forms-container", children: activeForm === "register" ? /* @__PURE__ */ jsx(RegisterForm, { setActiveForm }) : /* @__PURE__ */ jsx(LoginForm, { setActiveForm }) });
};

const Welcome = () => {
  const fetcher = async (url) => axios.get(url, {
    withCredentials: true
  }).then((res) => res.data);
  const { data, isLoading } = useSWR(
    `${"http://localhost:3000"}/check-auth`,
    fetcher
  );
  if (isLoading) {
    return /* @__PURE__ */ jsx("p", { className: "loading", children: /* @__PURE__ */ jsx("strong", { children: "Loading..." }) });
  }
  const username = data?.username;
  const accessToken = data?.accessToken;
  return username && accessToken ? /* @__PURE__ */ jsx(PersonalizedGreeting, { username, accessToken }) : /* @__PURE__ */ jsx(Forms, {});
};

const $$Astro = createAstro();
const $$CategoryCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategoryCard;
  const { title, options } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article class="category-card" data-astro-cid-d242pyyr> <h3 class="category-title" data-astro-cid-d242pyyr>${title}</h3> <ul class="api-options" data-astro-cid-d242pyyr> ${options.map((option) => renderTemplate`<li class="api-option" data-astro-cid-d242pyyr> <code class="api-code" data-astro-cid-d242pyyr> ${option.method} ${option.endpoint} </code> <span data-astro-cid-d242pyyr>${option.description}</span> </li>`)} </ul> </article> `;
}, "/Users/internetdrew/dev/projects/hackers-the-api/client/src/components/CategoryCard.astro", void 0);

const apiData = [
  {
    title: "Characters",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/characters",
        description: "returns a list of characters."
      },
      {
        method: "GET",
        endpoint: "/api/v1/characters/:id",
        description: "returns information on a particular character."
      },
      {
        method: "GET",
        endpoint: "api/v1/characters/:id/quotes",
        description: "returns famous lines from particular characters."
      },
      {
        method: "GET",
        endpoint: "api/v1/characters/:id/hacks",
        description: "returns hacks a character contributed to and was targeted by."
      }
    ]
  },
  {
    title: "Organizations",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/oranizations",
        description: "returns a list of organizations."
      },
      {
        method: "GET",
        endpoint: "/api/v1/oranizations/:id",
        description: "returns information on a specific organization."
      }
    ]
  },
  {
    title: "Hacks",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/oranizations",
        description: "returns a list of organizations."
      },
      {
        method: "GET",
        endpoint: "/api/v1/oranizations/:id",
        description: "returns information on a specific organization."
      }
    ]
  },
  {
    title: "Quotes",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/oranizations",
        description: "Returns a list of organizations."
      },
      {
        method: "GET",
        endpoint: "/api/v1/oranizations/:id",
        description: "Returns information on a specific organization."
      }
    ]
  }
];

const html = "<pre class=\"astro-code houston\" style=\"background-color:#17191e;color:#eef0f9; overflow-x: auto;\" tabindex=\"0\" data-language=\"javascript\"><code><span class=\"line\"><span style=\"color:#EEF0F98F;font-style:italic\">// Include your access token in authorization headers on requests.</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color:#54B9FF\">const</span><span style=\"color:#ACAFFF\"> res</span><span style=\"color:#EEF0F9\"> = </span><span style=\"color:#54B9FF\">await</span><span style=\"color:#00DAEF\"> fetch</span><span style=\"color:#EEF0F9\">(</span><span style=\"color:#4BF3C8\">url</span><span style=\"color:#EEF0F9\">, {</span></span>\n<span class=\"line\"><span style=\"color:#4BF3C8\">  method</span><span style=\"color:#EEF0F9\">: </span><span style=\"color:#FFD493\">\"GET\"</span><span style=\"color:#EEF0F9\">,</span></span>\n<span class=\"line\"><span style=\"color:#4BF3C8\">  headers</span><span style=\"color:#EEF0F9\">: {</span></span>\n<span class=\"line\"><span style=\"color:#4BF3C8\">    Authorization</span><span style=\"color:#EEF0F9\">: </span><span style=\"color:#FFD493\">`Bearer </span><span style=\"color:#54B9FF\">${</span><span style=\"color:#4BF3C8\">token</span><span style=\"color:#54B9FF\">}</span><span style=\"color:#FFD493\">`</span><span style=\"color:#EEF0F9\">,</span></span>\n<span class=\"line\"><span style=\"color:#EEF0F9\">  },</span></span>\n<span class=\"line\"><span style=\"color:#EEF0F9\">});</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"color:#54B9FF\">const</span><span style=\"color:#ACAFFF\"> data</span><span style=\"color:#EEF0F9\"> = </span><span style=\"color:#54B9FF\">await</span><span style=\"color:#4BF3C8\"> res</span><span style=\"color:#EEF0F9\">.</span><span style=\"color:#00DAEF\">json</span><span style=\"color:#EEF0F9\">();</span></span>\n<span class=\"line\"></span></code></pre>";

				const frontmatter = {};
				const file = "/Users/internetdrew/dev/projects/hackers-the-api/client/src/content/example/usage-example.md";
				const url = undefined;

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html)}`;
				});

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Hackers, The Unofficial Movie API", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <h1 class="header" data-astro-cid-j7pv25f6>Hackers, The Unofficial Movie API</h1> <p class="subtitle" data-astro-cid-j7pv25f6>
An API for the 1995 movie "Hackers" providing information on characters,
      organizations, quotes, and more.
</p> ${renderComponent($$result2, "Welcome", Welcome, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/internetdrew/dev/projects/hackers-the-api/client/src/components/Welcome", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} <section class="section" data-astro-cid-j7pv25f6> <h2 class="section-header" data-astro-cid-j7pv25f6>Usage</h2> <div class="code-card" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "UsageExample", Content, { "data-astro-cid-j7pv25f6": true })} </div> </section> <section class="section" data-astro-cid-j7pv25f6> <h2 class="section-header" data-astro-cid-j7pv25f6>API Endpoints</h2> ${apiData.map((category) => renderTemplate`${renderComponent($$result2, "CategoryCard", $$CategoryCard, { "title": category.title, "options": category.options, "data-astro-cid-j7pv25f6": true })}`)} </section> </main> ` })} `;
}, "/Users/internetdrew/dev/projects/hackers-the-api/client/src/pages/index.astro", void 0);

const $$file = "/Users/internetdrew/dev/projects/hackers-the-api/client/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
