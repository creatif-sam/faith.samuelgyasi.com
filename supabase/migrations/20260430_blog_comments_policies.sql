-- Allow authenticated users to delete blog comments (admin moderation)
drop policy if exists "Authenticated can delete blog comments" on public.blog_comments;
create policy "Authenticated can delete blog comments"
  on public.blog_comments
  for delete
  to authenticated
  using (true);

-- Notify admin when a new blog comment is submitted
create or replace function public.notify_on_blog_comment_insert()
returns trigger
language plpgsql
as $$
begin
  perform public.push_admin_notification(
    'blog_comments',
    new.id::text,
    'blog-comment',
    'New blog comment',
    coalesce(new.commenter_name, 'Anonymous') || ': ' || left(coalesce(new.comment_text, ''), 80),
    jsonb_build_object(
      'blog_post_id', new.blog_post_id,
      'commenter_name', new.commenter_name,
      'commenter_email', new.commenter_email
    )
  );
  return new;
end;
$$;

drop trigger if exists trg_notify_blog_comment_insert on public.blog_comments;
create trigger trg_notify_blog_comment_insert
after insert on public.blog_comments
for each row execute function public.notify_on_blog_comment_insert();
