# CS2 数据仓库查询手册

## 1. 核心设计理念

本数据库旨在通过事件驱动的方式，捕捉 CS2 比赛中的关键瞬间，为战术分析和 AI 复盘提供结构化数据。核心在于 `player_snapshots`（玩家快照）表，它记录了关键事件（如击杀、投掷物）发生时玩家的详细状态（位置、视角、装备等）。

查询时，通常的模式是：
1.  从一个核心实体表开始（如 `matches`, `players`）。
2.  关联到事件表（如 `kill_events`, `utility_events`）。
3.  如果需要事件发生时的上下文，再关联到 `player_snapshots` 表。

---

## 2. 数据类型定义 (ENUMs)

为了保证数据的一致性，数据库使用了一系列 ENUM 类型来约束特定字段的取值。

-   `cs2_team`: `('Terrorists', 'CounterTerrorists', 'Spectator', 'Unassigned')`
-   `cs2_weapon_class`: `('Pistol', 'SMG', 'Rifle', 'SniperRifle', 'Heavy', 'Grenade', 'Knife', 'C4', 'Equipment', 'Unknown')`
-   `cs2_bomb_event_type`: `('PlantBegin', 'Planted', 'DefuseStart', 'Defused', 'Exploded')`
-   `cs2_round_end_reason`: `('TargetBombed', 'CTsWin', 'TerroristsWin', 'TargetSaved', 'AllTerroristsEliminated', 'AllCTsEliminated', 'BombDefused', 'RoundDraw')`
-   `cs2_hitgroup`: `('Generic', 'Head', 'Chest', 'Stomach', 'LeftArm', 'RightArm', 'LeftLeg', 'RightLeg', 'Gear', 'Neck')`

---

## 3. 数据表结构与字段详解

### 静态数据表

#### `static_weapons`
存储游戏内所有武器的静态信息。
-   `id` (INTEGER, PK): 武器ID, 对应 `demoinfocs` 库的枚举值。
-   `name` (VARCHAR(255), UNIQUE): 武器的官方名称, e.g., "weapon_ak47"。
-   `class` (cs2_weapon_class): 武器分类。

### 核心实体表

#### `matches`
存储每场比赛的元数据。
-   `id` (BIGSERIAL, PK): 比赛唯一ID。
-   `demo_file_path` (TEXT, UNIQUE): Demo 文件的路径。
-   `map_name` (VARCHAR(255)): 地图名称, e.g., "de_dust2"。
-   `tick_rate` (INTEGER): 服务器的 Tick Rate。
-   `duration_ticks` (INTEGER): 整场比赛持续的总 Tick 数。
-   `parser_version` (VARCHAR(50)): 使用的解析器版本。
-   `parsed_at` (TIMESTAMPTZ): 解析完成的时间。

#### `players`
存储全局玩家信息。
-   `steam_id64` (BIGINT, PK): 玩家的 Steam64 ID。
-   `name` (TEXT): 玩家最后一次被记录的游戏内名称。
-   `created_at` (TIMESTAMPTZ): 首次记录该玩家的时间。
-   `last_seen_at` (TIMESTAMPTZ): 最后一次见到该玩家的时间。

#### `match_participants`
关联比赛和玩家，记录比赛的参与者。
-   `id` (BIGSERIAL, PK): 唯一ID。
-   `match_id` (BIGINT, FK -> matches.id): 比赛ID。
-   `player_steam_id64` (BIGINT, FK -> players.steam_id64): 玩家 Steam64 ID。
-   `initial_team` (cs2_team): 玩家在该场比赛的初始队伍。

#### `rounds`
存储每回合的概要信息。
-   `id` (BIGSERIAL, PK): 回合唯一ID。
-   `match_id` (BIGINT, FK -> matches.id): 比赛ID。
-   `round_number` (INTEGER): 回合数。
-   `start_tick` (INTEGER): 回合开始的 Tick。
-   `end_tick` (INTEGER): 回合结束的 Tick。
-   `winner_team` (cs2_team): 获胜队伍。
-   `end_reason` (cs2_round_end_reason): 回合结束原因。

### 核心事件与状态表

#### `player_snapshots`
**上下文核心表**。记录在特定事件触发时玩家的完整状态。
-   `id` (BIGSERIAL, PK): 快照唯一ID。
-   `match_id` (BIGINT, FK -> matches.id): 比赛ID。
-   `round_id` (BIGINT, FK -> rounds.id): 回合ID。
-   `tick` (INTEGER): 事件发生的 Tick。
-   `player_steam_id64` (BIGINT, FK -> players.steam_id64): 玩家 Steam64 ID。
-   `team` (cs2_team): 玩家当前所属队伍。
-   `pos_x`, `pos_y`, `pos_z` (REAL): 玩家坐标。
-   `view_angle_yaw`, `view_angle_pitch` (REAL): 玩家视角（水平和垂直）。
-   `health`, `armor` (SMALLINT): 生命值和护甲值。
-   `has_helmet` (BOOLEAN): 是否有头盔。
-   `money` (INTEGER): 当前金钱。
-   `active_weapon_id` (INTEGER, FK -> static_weapons.id): 当前手持武器ID。
-   `is_crouching`, `is_walking` (BOOLEAN): 是否蹲下或静步。
-   `trigger_event_type` (VARCHAR(50)): 触发此快照的事件类型 (e.g., 'KillAttacker')。
-   `trigger_event_id` (BIGINT): 触发此快照的事件ID。

#### `kill_events`
记录每一次击杀事件。
-   `id` (BIGSERIAL, PK): 击杀事件唯一ID。
-   `round_id` (BIGINT, FK -> rounds.id): 回合ID。
-   `tick` (INTEGER): 事件发生的 Tick。
-   `attacker_steam_id64` (BIGINT, FK -> players.steam_id64): 攻击者ID (可能为NULL，如摔死)。
-   `attacker_team` (cs2_team): 攻击者队伍 (冗余字段，便于查询)。
-   `victim_steam_id64` (BIGINT, FK -> players.steam_id64): 受害者ID。
-   `victim_team` (cs2_team): 受害者队伍 (冗余字段)。
-   `assister_steam_id64` (BIGINT, FK -> players.steam_id64): 助攻者ID。
-   `weapon_id` (INTEGER, FK -> static_weapons.id): 使用的武器ID。
-   `is_headshot` (BOOLEAN): 是否为爆头击杀。
-   `is_wallbang` (BOOLEAN): 是否为穿墙击杀。
-   `is_entry_kill` (BOOLEAN): 是否为首杀。
-   `is_trade_kill` (BOOLEAN): 是否为换人头。

#### `utility_events`
记录所有道具（手榴弹）的投掷事件。
-   `id` (BIGSERIAL, PK): 道具事件唯一ID。
-   `round_id` (BIGINT, FK -> rounds.id): 回合ID。
-   `tick` (INTEGER): 事件发生的 Tick。
-   `thrower_steam_id64` (BIGINT, FK -> players.steam_id64): 投掷者ID。
-   `thrower_snapshot_id` (BIGINT, FK -> player_snapshots.id): **核心关联**，链接到投掷者状态快照。
-   `utility_id` (INTEGER, FK -> static_weapons.id): 投掷的道具ID。
-   `throw_pos_x`, `throw_pos_y`, `throw_pos_z` (REAL): 投掷点坐标。
-   `land_pos_x`, `land_pos_y`, `land_pos_z` (REAL): 落点坐标。

#### `bomb_events`
记录C4相关的所有事件。
-   `id` (BIGSERIAL, PK): C4事件唯一ID。
-   `round_id` (BIGINT, FK -> rounds.id): 回合ID。
-   `tick` (INTEGER): 事件发生的 Tick。
-   `player_steam_id64` (BIGINT, FK -> players.steam_id64): 相关玩家ID (e.g., 下包者)。
-   `event_type` (cs2_bomb_event_type): 事件类型 (如下包、拆包、爆炸)。
-   `site` (VARCHAR(1)): 包点 ('A' 或 'B')。

---

## 4. 查询示例

以下是一个实用查询示例，您可以直接使用或作为参考来构建更复杂的分析。

### 查询: 在最新的比赛中，谁是“爆头哥”？
这个查询统计了每个玩家在单场比赛中的爆头击杀次数和爆头率。

```sql
-- 这个查询统计了每个玩家在单场比赛中的爆头击杀次数和爆头率。
SELECT
    p.player_name,
    -- 使用 FILTER 子句精确计算爆头数
    COUNT(ke.id) FILTER (WHERE ke.is_headshot = TRUE) AS headshot_kills,
    -- 计算总击杀数
    COUNT(ke.id) AS total_kills,
    -- 计算爆头率，并处理除以零的情况
    CASE
        WHEN COUNT(ke.id) > 0 THEN
            ROUND((COUNT(ke.id) FILTER (WHERE ke.is_headshot = TRUE) * 100.0 / COUNT(ke.id)), 2)
        ELSE
            0
    END AS headshot_percentage
FROM
    kill_events ke
-- 关联 players 表以获取玩家名称
JOIN players p ON ke.attacker_steam_id64 = p.steam_id64
-- 关联 rounds 表以通过 match_id 进行筛选
JOIN rounds r ON ke.round_id = r.id
WHERE
    -- 筛选出最新的一场比赛
    r.match_id = (SELECT id FROM matches ORDER BY parsed_at DESC LIMIT 1)
GROUP BY
    p.player_name
ORDER BY
    headshot_kills DESC, headshot_percentage DESC;
