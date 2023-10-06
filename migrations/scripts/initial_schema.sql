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
set schema 'public';


DO
$$
    declare
        tables_count integer := (select count(*)
                                 from information_schema.tables
                                 where table_schema = 'public');
    BEGIN
        if tables_count > 2 then
            return;
        else
            --
-- Name: twitterangular; Type: SCHEMA; Schema: -; Owner: -
--


            grant connect on database postgres to authenticator;

            --
-- Name: insert_image(bytea); Type: FUNCTION; Schema: twitterangular; Owner: -
--


            SET default_tablespace = '';

            SET default_table_access_method = heap;

            --
-- Name: posts; Type: TABLE; Schema: twitterangular; Owner: -
--

            CREATE TABLE posts
            (
                id            integer NOT NULL,
                body          text    NOT NULL,
                likes_count   integer DEFAULT 0,
                reposts_count integer DEFAULT 0,
                user_id       integer,
                image_id      integer
            );


            --
-- Name: like_post(json); Type: FUNCTION; Schema: twitterangular; Owner: -
--

            CREATE FUNCTION like_post(params json) RETURNS posts
                LANGUAGE plpgsql
            AS
            $_$
            declare
                current_likes int;
                post          posts;
            begin
                select likes_count into current_likes from posts where id = ($1 ->> 'id_param')::integer;
                update posts
                set likes_count = current_likes + 1
                where id = ($1 ->> 'id_param')::integer
                returning * into post;
                return post;
            end;
            $_$;


            --
-- Name: like_post2(json); Type: FUNCTION; Schema: twitterangular; Owner: -
--

            CREATE FUNCTION like_post2(params json) RETURNS json
                LANGUAGE plpgsql
            AS
            $foo$
            DECLARE
                current_likes INT;
                updated_post  JSON;
            BEGIN
                SELECT p.likes_count
                INTO current_likes
                FROM posts p
                WHERE p.id = (params ->> 'id_param')::INTEGER;

                UPDATE posts
                SET likes_count = current_likes + 1
                WHERE id = (params ->> 'id_param')::INTEGER
                RETURNING *
                    INTO updated_post;

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
            $foo$;


            --
-- Name: login(text, text); Type: FUNCTION; Schema: twitterangular; Owner: -
--

            CREATE FUNCTION login(username_param text, password_param text) RETURNS boolean
                LANGUAGE plpgsql
            AS
            $foo$
            declare
                success       boolean;
                selected_user int;
            begin
                select count(*)
                from users
                into selected_user
                    where
                username = username_param and password = password_param;

                if selected_user < 1 then
                    success = false;
                else
                    success = true;
                end if;

                return success;
            end;
            $foo$;


            --
-- Name: repost_post(json); Type: FUNCTION; Schema: twitterangular; Owner: -
--

            CREATE FUNCTION repost_post(params json) RETURNS posts
                LANGUAGE plpgsql
            AS
            $_$
            declare
                current_reposts int;
                post            posts;
            begin
                select reposts_count into current_reposts from posts where id = ($1 ->> 'id_param')::integer;
                update posts
                set reposts_count = current_reposts + 1
                where id = ($1 ->> 'id_param')::integer
                returning * into post;
                return post;
            end;
            $_$;


            --
-- Name: upload_image(); Type: FUNCTION; Schema: twitterangular; Owner: -
--

            CREATE FUNCTION upload_image() RETURNS void
                LANGUAGE plpgsql
            AS
            $_$
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

            CREATE TABLE images
            (
                id         integer NOT NULL,
                image      text,
                image_path character varying(255)
            );


            --
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

            CREATE SEQUENCE images_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;


            --
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

            ALTER SEQUENCE images_id_seq OWNED BY images.id;


            --
-- Name: fisk; Type: TABLE; Schema: twitterangular; Owner: -
--

            CREATE TABLE fisk
            (
                id  integer NOT NULL,
                art text    NOT NULL
            );


            --
-- Name: fisk_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

            CREATE SEQUENCE fisk_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;


            --
-- Name: fisk_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

            ALTER SEQUENCE fisk_id_seq OWNED BY fisk.id;


            --
-- Name: images; Type: TABLE; Schema: twitterangular; Owner: -
--


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

            ALTER SEQUENCE images_id_seq OWNED BY images.id;


            --
-- Name: post_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

            CREATE SEQUENCE post_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;


            --
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

            ALTER SEQUENCE post_id_seq OWNED BY posts.id;


            --
-- Name: users; Type: TABLE; Schema: twitterangular; Owner: -
--

            CREATE TABLE users
            (
                id       integer NOT NULL,
                username text    NOT NULL,
                email    text    NOT NULL,
                password text    NOT NULL,
                bio      text
            );


            --
-- Name: users_id_seq; Type: SEQUENCE; Schema: twitterangular; Owner: -
--

            CREATE SEQUENCE users_id_seq
                AS integer
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;


            --
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: twitterangular; Owner: -
--

            ALTER SEQUENCE users_id_seq OWNED BY users.id;


            --
-- Name: images id; Type: DEFAULT; Schema: public; Owner: -
--

            ALTER TABLE ONLY images
                ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


            --
-- Name: fisk id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY fisk
                ALTER COLUMN id SET DEFAULT nextval('fisk_id_seq'::regclass);


            --
-- Name: images id; Type: DEFAULT; Schema: twitterangular; Owner: -
--


--
-- Name: posts id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY posts
                ALTER COLUMN id SET DEFAULT nextval('post_id_seq'::regclass);


            --
-- Name: users id; Type: DEFAULT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY users
                ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


            --
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

            ALTER TABLE ONLY images
                ADD CONSTRAINT images_pkey PRIMARY KEY (id);


            --
-- Name: fisk fisk_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY fisk
                ADD CONSTRAINT fisk_pkey PRIMARY KEY (id);


            --
-- Name: images images_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--


--
-- Name: posts post_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY posts
                ADD CONSTRAINT post_pkey PRIMARY KEY (id);


            --
-- Name: users users_email_key; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY users
                ADD CONSTRAINT users_email_key UNIQUE (email);


            --
-- Name: users users_pkey; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY users
                ADD CONSTRAINT users_pkey PRIMARY KEY (id);


            --
-- Name: users users_username_key; Type: CONSTRAINT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY users
                ADD CONSTRAINT users_username_key UNIQUE (username);


            --
-- Name: posts fk_image_id; Type: FK CONSTRAINT; Schema: twitterangular; Owner: -
--

/*ALTER TABLE ONLY posts
    ADD CONSTRAINT fk_image_id FOREIGN KEY (image_id) REFERENCES images(id);*/


--
-- Name: posts fk_user_id; Type: FK CONSTRAINT; Schema: twitterangular; Owner: -
--

            ALTER TABLE ONLY posts
                ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id);


            --
-- Name: SCHEMA twitterangular; Type: ACL; Schema: -; Owner: -
--

            GRANT ALL ON SCHEMA public TO web_anon;
            GRANT USAGE ON SCHEMA public TO twitter_user;
            GRANT ALL ON SCHEMA public TO authenticator;


            --
-- Name: TABLE posts; Type: ACL; Schema: twitterangular; Owner: -
--

            GRANT SELECT ON TABLE posts TO web_anon;
            GRANT ALL ON TABLE posts TO twitter_user;
            GRANT ALL ON TABLE posts TO authenticator;


            --
-- Name: TABLE images; Type: ACL; Schema: public; Owner: -
--

            GRANT ALL ON TABLE images TO authenticator;


            --
-- Name: TABLE fisk; Type: ACL; Schema: twitterangular; Owner: -
--

            GRANT ALL ON TABLE fisk TO authenticator;


            --
-- Name: TABLE images; Type: ACL; Schema: twitterangular; Owner: -
--

            GRANT ALL ON TABLE images TO authenticator;


            --
-- Name: SEQUENCE post_id_seq; Type: ACL; Schema: twitterangular; Owner: -
--

            GRANT SELECT, USAGE ON SEQUENCE post_id_seq TO twitter_user;


            --
-- Name: TABLE users; Type: ACL; Schema: twitterangular; Owner: -
--

            GRANT ALL ON TABLE users TO authenticator;


            --
-- PostgreSQL database dump complete
--


            CREATE FUNCTION insert_image(image_data bytea) RETURNS integer
                LANGUAGE plpgsql
            AS
            $foo$
            DECLARE
                image_id INTEGER;
            BEGIN
                -- Insert the image data into the table
                INSERT INTO images (image)
                VALUES (image_data)
                RETURNING id
                    INTO image_id;

-- Return the inserted id
                RETURN image_id;
            END;
            $foo$;
        end if;

    END
$$;