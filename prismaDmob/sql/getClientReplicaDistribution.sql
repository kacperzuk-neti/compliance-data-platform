with replicas as (
    select
        'f0' || "clientId" as client,
        "pieceCid" as piece_cid,
        count(distinct "providerId") as num_of_replicas,
        sum("pieceSize") as total_deal_size,
        max("pieceSize") as piece_size
    from unified_verified_deal
    where
        "termStart" >= 3847920 -- nv22 start
        and "sectorId" != '0'
    group by
        client,
        piece_cid
)
select
    client,
    num_of_replicas::int as num_of_replicas,
    sum(total_deal_size)::bigint as total_deal_size,
    sum(piece_size)::bigint as unique_data_size
from replicas
group by
  client,
  num_of_replicas;