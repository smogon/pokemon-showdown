--- This is a separate file so migrations don't have to be done.

CREATE TEMPORARY VIEW friends_simplified (
	userid, friend
) AS SELECT user1 as friend, user2 as userid FROM friends UNION ALL SELECT user2 as friend, user1 as userid FROM friends;

CREATE INDEX IF NOT EXISTS reverse_list ON friends (user2, user1);
CREATE INDEX IF NOT EXISTS reverse_request_list ON friend_requests (receiver, sender);
