--! Previous: sha1:541f19fc9e3ed69e50f398cdc288a6ed0b9a9fa5
--! Hash: sha1:37203e4c64e7eb64f9c1f6290b11c7ccdcb6c608
--! Message: like comment function

-- Enter migration here
create or replace function like_comment(params json)
    returns comments as $$
declare
    current_likes int;
    comment comments;
begin
    select likes_count into current_likes from comments where id = ($1 ->> 'id_param')::integer;
    update comments set likes_count = current_likes + 1 where id = ($1 ->> 'id_param')::integer returning * into comment;
    return comment;
end;
$$ language plpgsql
