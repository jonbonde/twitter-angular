--! Previous: sha1:37203e4c64e7eb64f9c1f6290b11c7ccdcb6c608
--! Hash: sha1:e7b6708d5d6575ff5a15362f468a0eb17260bf7c

-- Enter migration here
create table if NOT EXISTS likes (
    id serial primary key,
    post_id int,
    user_id int,
    CONSTRAINT fk_posts_likes foreign key(post_id) references posts(id),
    constraint fk_user_likes foreign key(user_id) references users(id)
);

create table if NOT EXISTS reposts (
    id serial primary key,
    post_id int,
    user_id int,
    CONSTRAINT fk_posts_reposts foreign key(post_id) references posts(id),
    constraint fk_user_reposts foreign key(user_id) references users(id)
);

create table if NOT EXISTS comments_likes (
    id serial primary key,
    comment_id int,
    user_id int,
    CONSTRAINT fk_comments_likes foreign key(comment_id) references comments(id),
    constraint fk_user_comments_likes foreign key(user_id) references users(id)
);

create or replace function get_user_id(username_param text) returns int AS $$
declare id_return int;
begin
select id into id_return
from users
where username = username_param;
return id_return;
end;
$$ language plpgsql;
CREATE OR REPLACE FUNCTION "public"."like_post"("params" json) RETURNS "public"."posts" AS $BODY$
declare current_likes int;
post posts;
sjekk int;
begin
select count(*) into sjekk
from likes
where post_id = ($1->>'post_id_param')::integer
    and user_id = ($1->>'user_id_param')::integer;
if sjekk < 1 then
insert into likes (user_id, post_id)
values (
        ($1->>'user_id_param')::integer,
        ($1->>'post_id_param')::integer
    );
select likes_count into current_likes
from posts
where id = ($1->>'id_param')::integer;
update posts
set likes_count = current_likes + 1
where id = ($1->>'id_param')::integer
returning * into post;
return post;
else
delete from likes
where user_id = ($1->>'user_id_param')::integer
    and post_id = ($1->>'post_id_param')::integer;
select likes_count into current_likes
from posts
where id = ($1->>'id_param')::integer;
update posts
set likes_count = current_likes - 1
where id = ($1->>'id_param')::integer
returning * into post;
return post;
end if;
end;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE OR REPLACE FUNCTION "public"."repost_post"("params" json) RETURNS "public"."posts" AS $BODY$
declare current_reposts int;
post posts;
sjekk int;
begin
select count(*) into sjekk
from reposts
where post_id = ($1->>'post_id_param')::integer
    and user_id = ($1->>'user_id_param')::integer;
if sjekk < 1 then
insert into reposts (user_id, post_id)
values (
        ($1->>'user_id_param')::integer,
        ($1->>'post_id_param')::integer
    );
select reposts_count into current_reposts
from posts
where id = ($1->>'id_param')::integer;
update posts
set reposts_count = current_reposts + 1
where id = ($1->>'id_param')::integer
returning * into post;
return post;
ELSE
delete from reposts
where user_id = ($1->>'user_id_param')::integer
    and post_id = ($1->>'post_id_param')::integer;
select reposts_count into current_reposts
from posts
where id = ($1->>'id_param')::integer;
update posts
set reposts_count = current_reposts + 1
where id = ($1->>'id_param')::integer
returning * into post;
return post;
end if;
end;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;

CREATE OR REPLACE FUNCTION "public"."like_comment"("params" json) RETURNS "public"."comments" AS $BODY$
declare current_likes int;
comment comments;
sjekk int;
begin
select count(*) into sjekk
from comments_likes
where comment_id = ($1->>'id_param')::integer
    and user_id = ($1->>'user_id_param')::integer;
if sjekk < 1 then
insert into comments_likes (comment_id, user_id)
values (
        ($1->>'id_param')::integer,
        ($1->>'user_id_param')::integer
    );
select likes_count into current_likes
from comments
where id = ($1->>'id_param')::integer;
update comments
set likes_count = current_likes + 1
where id = ($1->>'id_param')::integer
returning * into comment;
return comment;
else
delete from comments_likes
where comment_id = ($1->>'id_param')::integer
    and user_id = ($1->>'user_id_param')::integer;
select likes_count into current_likes
from comments
where id = ($1->>'id_param')::integer;
update comments
set likes_count = current_likes - 1
where id = ($1->>'id_param')::integer
returning * into comment;
return comment;
end if;
end;
$BODY$ LANGUAGE plpgsql VOLATILE COST 100;
