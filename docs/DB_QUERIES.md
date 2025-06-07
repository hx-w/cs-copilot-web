# CS2 数据仓库查询手册

本手册旨在为 CS2 深度分析数据仓库的使用者提供一份详尽的数据库查询指南。它详细介绍了数据库的设计理念、表结构，并提供了丰富的实用查询示例，以帮助分析师、开发者和爱好者从原始数据中提取有价值的战术信息。

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

#### `damage_events`
记录每一次伤害事件，是分析交火过程的关键。
-   `id` (BIGSERIAL, PK): 伤害事件唯一ID。
-   `round_id` (BIGINT, FK -> rounds.id): 回合ID。
-   `tick` (INTEGER): 事件发生的 Tick。
-   `attacker_steam_id64` (BIGINT, FK -> players.steam_id64): 攻击者ID。
-   `victim_steam_id64` (BIGINT, FK -> players.steam_id64): 受害者ID。
-   `weapon_id` (INTEGER, FK -> static_weapons.id): 造成伤害的武器ID。
-   `hitgroup` (cs2_hitgroup): 命中部位。
-   `health_damage` (INTEGER): 对生命值造成的伤害。
-   `armor_damage` (INTEGER): 对护甲造成的伤害。
-   `is_fatal` (BOOLEAN): 该次伤害是否致命。

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

#### `flash_effects`
记录闪光弹对玩家造成的具体效果。
-   `id` (BIGSERIAL, PK): 唯一ID。
-   `utility_event_id` (BIGINT, FK -> utility_events.id): 关联的投掷事件ID。
-   `flashed_player_steam_id64` (BIGINT, FK -> players.steam_id64): 被闪光影响的玩家ID。
-   `blind_duration_ms` (INTEGER): 致盲持续时间（毫秒）。

#### `fire_effects`
记录燃烧弹或燃烧瓶产生的火焰区域效果。
-   `id` (BIGSERIAL, PK): 唯一ID。
-   `utility_event_id` (BIGINT, FK -> utility_events.id): 关联的投掷事件ID。
-   `start_tick` (INTEGER): 火焰开始燃烧的 Tick。
-   `end_tick` (INTEGER): 火焰熄灭的 Tick。
-   `center_x`, `center_y`, `center_z` (REAL): 火焰中心坐标。
-   `radius` (REAL): 火焰影响半径。

#### `smoke_effects`
记录烟雾弹产生的烟雾区域效果。
-   `id` (BIGSERIAL, PK): 唯一ID。
-   `utility_event_id` (BIGINT, FK -> utility_events.id): 关联的投掷事件ID。
-   `start_tick` (INTEGER): 烟雾生效的 Tick。
-   `end_tick` (INTEGER): 烟雾消散的 Tick。
-   `pos_x`, `pos_y`, `pos_z` (REAL): 烟雾中心坐标。

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

以下是一些实用的查询示例，您可以直接使用或作为参考来构建更复杂的分析。

### 示例 1: 谁是最新比赛中的“爆头哥”？
此查询统计单场比赛中，每位玩家的爆头击杀数、总击杀数和爆头率。

```sql
-- 目的: 识别单场比赛中的爆头王。
SELECT
    p.name AS player_name,
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
    AND ke.attacker_steam_id64 IS NOT NULL
GROUP BY
    p.name
ORDER BY
    headshot_kills DESC, headshot_percentage DESC;
```

### 示例 2: 分析特定玩家的闪光弹使用效率
此查询分析指定玩家（以 'ZywOo' 为例）投掷的闪光弹对敌人造成的平均致盲时间和总次数。

```sql
-- 目的: 评估一名选手闪光弹的质量。
SELECT
    p.name AS thrower_name,
    COUNT(fe.id) AS total_flashes_landed,
    AVG(fe.blind_duration_ms) AS avg_blind_duration_ms,
    SUM(CASE WHEN fe.blind_duration_ms > 1500 THEN 1 ELSE 0 END) AS effective_flashes -- 致盲超过1.5秒的闪光
FROM
    utility_events ue
JOIN
    flash_effects fe ON ue.id = fe.utility_event_id
JOIN
    players p ON ue.thrower_steam_id64 = p.steam_id64
JOIN
    static_weapons sw ON ue.utility_id = sw.id
WHERE
    p.name ILIKE '%ZywOo%' -- 不区分大小写匹配玩家名
    AND sw.name = 'weapon_flashbang'
    -- 确保被闪的是敌人
    AND EXISTS (
        SELECT 1
        FROM rounds r
        JOIN player_snapshots ps_thrower ON r.id = ps_thrower.round_id AND ps_thrower.player_steam_id64 = ue.thrower_steam_id64 AND ps_thrower.tick = ue.tick
        JOIN player_snapshots ps_flashed ON r.id = ps_flashed.round_id AND ps_flashed.player_steam_id64 = fe.flashed_player_steam_id64 AND ps_flashed.tick > ue.tick
        WHERE r.id = ue.round_id AND ps_thrower.team != ps_flashed.team
        LIMIT 1
    )
GROUP BY
    p.name;
```
