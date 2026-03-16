insert into
    users (user_id, region)
values ('eu_mod_1', 'eu'),
    ('eu_mod_2', 'eu'),
    ('us_mod_1', 'us'),
    ('us_mod_2', 'us'),
    ('asia_mod_1', 'asia'),
    ('asia_mod_2', 'asia');

insert into
    events (
        event_id,
        region,
        status,
        claimed_by,
        claimed_at
    )
values (1, 'eu', 'open', null, null),
    (
        2,
        'eu',
        'claimed',
        'eu_mod_1',
        '2024-01-01 10:00:00'
    ),
    (3, 'us', 'open', null, null),
    (
        4,
        'us',
        'claimed',
        'us_mod_2',
        '2024-01-02 11:00:00'
    ),
    (5, 'asia', 'open', null, null),
    (
        6,
        'asia',
        'claimed',
        'asia_mod_1',
        '2024-01-03 12:00:00'
    );