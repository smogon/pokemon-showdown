--- This is a separate file so migrations don't have to be done.

CREATE TEMPORARY VIEW friends_simplified (
	userid, friend
) AS SELECT user1 as friend, user2 as userid FROM friends UNION SELECT user1 as userid, user2 as friend FROM friends;
