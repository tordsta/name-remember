--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: delete_person(text, uuid); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.delete_person(user_email text, person_id uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  user_id UUID;
  count INTEGER;
BEGIN
  -- Get the user id
  SELECT id INTO user_id FROM users WHERE email = user_email;

  -- Check if the user owns a list that contains the person
  SELECT COUNT(*) INTO count
  FROM people_lists pl
  JOIN people_in_lists pil ON pil.people_list_id = pl.id
  WHERE pil.people_id = person_id AND pl.owner_id = user_id;

  -- If the count is 0, the user does not have access to delete the person
  IF count = 0 THEN
    RAISE 'User does not have access to delete this person';
  END IF;

  -- Delete the person from people_in_lists and people tables
  DELETE FROM people_in_lists WHERE people_id = person_id;
  DELETE FROM people WHERE id = person_id;
END;
$$;


ALTER FUNCTION public.delete_person(user_email text, person_id uuid) OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    provider_id character varying(255) NOT NULL,
    provider_type character varying(255) NOT NULL,
    provider_account_id character varying(255) NOT NULL,
    refresh_token text,
    access_token text NOT NULL,
    expires_at timestamp with time zone,
    token_type character varying(255),
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO "default";

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accounts_id_seq OWNER TO "default";

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: auth_sessions; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.auth_sessions (
    id integer NOT NULL,
    expires timestamp with time zone NOT NULL,
    session_token text NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.auth_sessions OWNER TO "default";

--
-- Name: auth_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.auth_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_sessions_id_seq OWNER TO "default";

--
-- Name: auth_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.auth_sessions_id_seq OWNED BY public.auth_sessions.id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.people (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fname character varying(50) NOT NULL,
    mname character varying(50) NOT NULL,
    lname character varying(50) NOT NULL,
    image text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.people OWNER TO "default";

--
-- Name: people_in_lists; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.people_in_lists (
    people_id uuid NOT NULL,
    people_list_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.people_in_lists OWNER TO "default";

--
-- Name: people_lists; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.people_lists (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(50) NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    rrule text,
    rrule_start timestamp without time zone,
    reminder_trigger_time timestamp without time zone
);


ALTER TABLE public.people_lists OWNER TO "default";

--
-- Name: user_feedback; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.user_feedback (
    id integer NOT NULL,
    email character varying(255),
    type character varying(100) NOT NULL,
    message text NOT NULL,
    file text
);


ALTER TABLE public.user_feedback OWNER TO "default";

--
-- Name: user_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.user_feedback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_feedback_id_seq OWNER TO "default";

--
-- Name: user_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.user_feedback_id_seq OWNED BY public.user_feedback.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified boolean DEFAULT false,
    image text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO "default";

--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.verification_tokens (
    identifier character varying(255) NOT NULL,
    token text NOT NULL,
    expires timestamp with time zone NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO "default";

--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: auth_sessions id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_sessions ALTER COLUMN id SET DEFAULT nextval('public.auth_sessions_id_seq'::regclass);


--
-- Name: user_feedback id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_feedback ALTER COLUMN id SET DEFAULT nextval('public.user_feedback_id_seq'::regclass);

--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.accounts_id_seq', 7, true);


--
-- Name: auth_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.auth_sessions_id_seq', 23, true);


--
-- Name: user_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.user_feedback_id_seq', 2, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: auth_sessions auth_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_pkey PRIMARY KEY (id);


--
-- Name: people_lists people_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.people_lists
    ADD CONSTRAINT people_lists_pkey PRIMARY KEY (id);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: people_lists unique_owner_id_name; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.people_lists
    ADD CONSTRAINT unique_owner_id_name UNIQUE (owner_id, name);


--
-- Name: user_feedback user_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_feedback
    ADD CONSTRAINT user_feedback_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: verification_tokens verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.verification_tokens
    ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (identifier);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: auth_sessions auth_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT auth_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: people_lists fk_owner; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.people_lists
    ADD CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: people_in_lists fk_people; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.people_in_lists
    ADD CONSTRAINT fk_people FOREIGN KEY (people_id) REFERENCES public.people(id) ON DELETE CASCADE;


--
-- Name: people_in_lists fk_people_list; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.people_in_lists
    ADD CONSTRAINT fk_people_list FOREIGN KEY (people_list_id) REFERENCES public.people_lists(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

