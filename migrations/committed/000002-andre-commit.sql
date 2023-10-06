--! Previous: sha1:afc82ed3d8851418259f30697ab94dbfcf7fac36
--! Hash: sha1:541f19fc9e3ed69e50f398cdc288a6ed0b9a9fa5
--! Message: Andre commit

-- Enter migration here
alter table images
drop column if exists image;

alter table posts
    drop constraint if exists fk_image_id;

alter table posts
add constraint fk_image_id
foreign key (image_id)
references images (id);
