--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4 (Debian 15.4-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg22.04+1)

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
-- Name: twitterangular; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA twitterangular;


--
-- Name: insert_image(bytea); Type: FUNCTION; Schema: twitterangular; Owner: -
--

CREATE FUNCTION twitterangular.insert_image(image_data bytea) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    image_id INTEGER;
BEGIN
    -- Insert the image data into the table
    INSERT INTO images (image) VALUES (image_data) RETURNING id INTO image_id;

    -- Return the inserted id
    RETURN image_id;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: twitterangular; Owner: -
--

CREATE TABLE twitterangular.posts (
    id integer NOT NULL,
    body text NOT NULL,
    likes_count integer DEFAULT 0,
    reposts_count integer DEFAULT 0,
    user_id integer,
    image_id integer
);


--
-- Name: like_post(json); Type: FUNCTION; Schema: twitterangular; Owner: -
--

CREATE FUNCTION twitterangular.like_post(params json) RETURNS twitterangular.posts
    LANGUAGE plpgsql
    AS $_$
declare 
	current_likes int;
	post twitterangular.posts;
begin
	select likes_count into current_likes from posts where id = ($1 ->> 'id_param')::integer;
	update posts set likes_count = current_likes + 1 where id = ($1 ->> 'id_param')::integer returning * into post;
	return post;
end;
$_$;


--
-- Name: like_post2(json); Type: FUNCTION; Schema: twitterangular; Owner: -
--

CREATE FUNCTION twitterangular.like_post2(params json) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE 
  current_likes INT;
  updated_post JSON;
BEGIN
  SELECT p.likes_count INTO current_likes 
  FROM posts p 
  WHERE p.id = (params ->> 'id_param')::INTEGER;
  
  UPDATE posts 
  SET likes_count = current_likes + 1 
  WHERE id = (params ->> 'id_param')::INTEGER
  RETURNING * INTO updated_post;
  
  -- Join with users table to include user information
  SELECT json_build_object(
    'id', updated_post.id,
    'body', updated_post.body,
    'likes_count', updated_post.likes_count,
    'reposts_count', updated_post.reposts_count,
    'user', json_build_object(
      'id', u.id,
      'username', u.username
      -- Add any other user fields you want to include
    )
  )
  INTO updated_post
  FROM users u
  WHERE u.id = updated_post.user_id;
  
  RETURN updated_post;
END;
$$;


--
-- Name: login(text, text); Type: FUNCTION; Schema: twitterangular; Owner: -
--

CREATE FUNCTION twitterangular.login(username_param text, password_param text) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare 
	success boolean;
	selected_user int;
begin
	select count(*) from twitterangular.users
	into selected_user
	where username = username_param and password = password_param;
	
	if selected_user < 1 then
		success = false;
	else
		success = true;
	end if;

	return success;
end;
$$;


--
-- Name: repost_post(json); Type: FUNCTION; Schema: twitterangular; Owner: -
--

CREATE FUNCTION twitterangular.repost_post(params json) RETURNS twitterangular.posts
    LANGUAGE plpgsql
    AS $_$
declare 
	current_reposts int;
	post twitterangular.posts;
begin
	select reposts_count into current_reposts from posts where id = ($1 ->> 'id_param')::integer;
	update posts set reposts_count = current_reposts + 1 where id = ($1 ->> 'id_param')::integer returning * into post;
	return post;
end;
$_$;


--
-- Name: upload_image(); Type: FUNCTION; Schema: twitterangular; Owner: -
--

CREATE FUNCTION twitterangular.upload_image() RETURNS void
    LANGUAGE plpgsql
    AS $_$
declare
  image_data bytea;
begin
  select into image_data pg_read_binary_file($1::text);

  insert into images (image) VALUES (image_data);
end;
$_$;


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id integer NOT NULL,
    image text,
    image_path character varying(255)
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: fisk; Type: TABLE; Schema: twitterangular; Owner: -
--

CREATE TABLE twitterangular.fisk (
    id integer NOT NULL,
    art text NOT NULL
);


--
-- Name: fisk_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

CREATE SEQUENCE twitterangular.fisk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fisk_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

ALTER SEQUENCE twitterangular.fisk_id_seq OWNED BY twitterangular.fisk.id;


--
-- Name: images; Type: TABLE; Schema: twitterangular; Owner: -
--

CREATE TABLE twitterangular.images (
    id integer NOT NULL,
    image_path character varying(255)
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

CREATE SEQUENCE twitterangular.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

ALTER SEQUENCE twitterangular.images_id_seq OWNED BY twitterangular.images.id;


--
-- Name: post_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

CREATE SEQUENCE twitterangular.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

ALTER SEQUENCE twitterangular.post_id_seq OWNED BY twitterangular.posts.id;


--
-- Name: users; Type: TABLE; Schema: twitterangular; Owner: -
--

CREATE TABLE twitterangular.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    bio text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

CREATE SEQUENCE twitterangular.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

ALTER SEQUENCE twitterangular.users_id_seq OWNED BY twitterangular.users.id;


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: fisk id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.fisk ALTER COLUMN id SET DEFAULT nextval('twitterangular.fisk_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.images ALTER COLUMN id SET DEFAULT nextval('twitterangular.images_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.posts ALTER COLUMN id SET DEFAULT nextval('twitterangular.post_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.users ALTER COLUMN id SET DEFAULT nextval('twitterangular.users_id_seq'::regclass);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: fisk fisk_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.fisk
    ADD CONSTRAINT fisk_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: posts post_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.posts
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: posts fk_image_id; Type: FK CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.posts
    ADD CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES twitterangular.images(id);


--
-- Name: posts fk_user_id; Type: FK CONSTRAINT; Schema: twitterangular; Owner: -
--

ALTER TABLE ONLY twitterangular.posts
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES twitterangular.users(id);


--
-- Name: SCHEMA twitterangular; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA twitterangular TO web_anon;
GRANT USAGE ON SCHEMA twitterangular TO twitter_user;
GRANT ALL ON SCHEMA twitterangular TO authenticator;


--
-- Name: TABLE posts; Type: ACL; Schema: twitterangular; Owner: -
--

GRANT SELECT ON TABLE twitterangular.posts TO web_anon;
GRANT ALL ON TABLE twitterangular.posts TO twitter_user;
GRANT ALL ON TABLE twitterangular.posts TO authenticator;


--
-- Name: TABLE images; Type: ACL; Schema: public; Owner: -
--

GRANT ALL ON TABLE public.images TO authenticator;


--
-- Name: TABLE fisk; Type: ACL; Schema: twitterangular; Owner: -
--

GRANT ALL ON TABLE twitterangular.fisk TO authenticator;


--
-- Name: TABLE images; Type: ACL; Schema: twitterangular; Owner: -
--

GRANT ALL ON TABLE twitterangular.images TO authenticator;


--
-- Name: SEQUENCE post_id_seq; Type: ACL; Schema: twitterangular; Owner: -
--

GRANT SELECT,USAGE ON SEQUENCE twitterangular.post_id_seq TO twitter_user;


--
-- Name: TABLE users; Type: ACL; Schema: twitterangular; Owner: -
--

GRANT ALL ON TABLE twitterangular.users TO authenticator;


--
-- PostgreSQL database dump complete
--

