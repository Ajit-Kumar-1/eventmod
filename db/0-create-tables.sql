create table users (
    user_id text primary key,
    region text not null
);

create table events (
    event_id text primary key,
    region text not null,
    status text not null,
    claimed_by text references users (user_id),
    claimed_at timestamp default null
)