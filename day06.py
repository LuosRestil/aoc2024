import time

start = time.time()

next_pos_mods = {
    '^': [-1, 0],
    'v': [1, 0],
    '<': [0, -1],
    '>': [0, 1]
}
turns = {
    '^': '>',
    'v': '<',
    '<': '^',
    '>': 'v'
}
filename = 'inputs/day06.txt'


def run_pt_1():
    with open(filename, 'r') as infile:
        grid = [list(line.strip()) for line in infile.readlines()]
        solve(grid)
        return grid


def run_pt_2(trodden):
    with open(filename, 'r') as infile:
        grid = [list(line.strip()) for line in infile.readlines()]
        guard_pos = get_guard_pos(grid)
        count = 0
        for pos in trodden:
            if pos[0] == guard_pos[0] and pos[1] == guard_pos[1]: continue
            copy = [row[:] for row in grid]
            copy[pos[0]][pos[1]] = '#'
            completed = solve(copy)
            if not completed:
                count += 1
        print(f'Part 2: {count}')


def solve(grid) -> bool:
    guard_pos = get_guard_pos(grid)
    path = {}
    while is_in_grid(grid, guard_pos):
        if not tick(grid, guard_pos, path):
            return False
    return True


def get_guard_pos(grid):
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '^':
                return [i, j]


def is_in_grid(grid, pos):
    return pos[0] >= 0 and pos[0] < len(grid) and pos[1] >= 0 and pos[1] < len(grid[0])


def tick(grid, pos, path) -> bool:
    direction = grid[pos[0]][pos[1]]
    move(grid, pos, direction)
    path_key = f'{pos[0]}:{pos[1]}'
    if path_key in path and grid[pos[0]][pos[1]] in path[path_key]:
        return False
    try:
        path[path_key] = [] if not path_key in path else path[path_key]
        path[path_key].append(grid[pos[0]][pos[1]])
    except:
        pass
    return True


def move(grid, pos, direction):
    next_pos_mod = next_pos_mods[direction]
    next_pos = [pos[0] + next_pos_mod[0], pos[1] + next_pos_mod[1]]
    has_turned = False
    if is_in_grid(grid, next_pos):
        if grid[next_pos[0]][next_pos[1]] == '#':
            grid[pos[0]][pos[1]] = turns[direction]
            has_turned = True
        else:
            grid[next_pos[0]][next_pos[1]] = direction

    if not has_turned:
        pos[0] = next_pos[0]
        pos[1] = next_pos[1]


def count_trodden(grid):
    count = 0
    for row in grid:
        for col in row:
            if col in turns:
                count += 1
    return count


def print_grid(grid):
    for row in grid:
        for col in row:
            print(col, end='')
        print('\n', end='')


p1_grid = run_pt_1()
print(f'Part 1: {count_trodden(p1_grid)}')
# print_grid(p1_grid)

trodden = []
for i in range(len(p1_grid)):
    for j in range(len(p1_grid[0])):
        if p1_grid[i][j] in turns:
            trodden.append([i, j])
run_pt_2(trodden)

end = time.time()
print(f'time: {end - start}s')