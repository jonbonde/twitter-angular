--! Previous: -
--! Hash: sha1:afc82ed3d8851418259f30697ab94dbfcf7fac36
--! Message: Hei

-- Enter migration here
set schema 'public';

drop table if exists comments;
create table if not exists comments
(
    id          serial primary key,
    body        text not null,
    likes_count int not null default 0,
    post_id int not null,
    constraint fk_post_id foreign key (post_id) references posts (id)
);
