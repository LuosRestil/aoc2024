import time
start = time.time()

def print_grid(grid):
    for row in grid:
        for col in row:
            print(col, end='')
        print('\n', end='')

def is_in_grid(grid, pos):
    return pos[0] >= 0 and pos[0] < len(grid) and pos[1] >= 0 and pos[1] < len(grid[0])

filename = 'inputs/day08.txt'
infile = open(filename, 'r')
grid = [list(line.strip()) for line in infile.readlines()]
# print_grid(grid)
infile.close()

antennae = dict()
for i in range(len(grid)):
    for j in range(len(grid[0])):
        ch = grid[i][j]
        if ch != '.':
            if not ch in antennae:
                antennae[ch] = []
            antennae[ch].append((i, j))

antinodes = set()
for locs in antennae.values():
    for i in range(len(locs)):
        loc_a = locs[i]
        for j in range(i + 1, len(locs)):
            loc_b = locs[j]

            top = loc_a if loc_a[0] < loc_b[0] else loc_b
            bottom = loc_a if top == loc_b else loc_b
            left = loc_a if loc_a[1] < loc_b[1] else loc_b
            right = loc_a if left == loc_b else loc_b

            dist = (bottom[0] - top[0], right[1] - left[1])

            # print(f'a: {loc_a}, b: {loc_b}, dist: {dist}')
            if top == left:
                # print((top[0] - dist[0], left[1] - dist[1]))
                # print((bottom[0] + dist[0], right[1] + dist[1]))
                antinodes.add((top[0] - dist[0], left[1] - dist[1]))
                antinodes.add((bottom[0] + dist[0], right[1] + dist[1]))
            else:
                # print((bottom[0] + dist[0], left[1] - dist[1]))
                # print((top[0] - dist[0], right[1] + dist[1]))
                antinodes.add((bottom[0] + dist[0], left[1] - dist[1]))
                antinodes.add((top[0] - dist[0], right[1] + dist[1]))
            # print()

antinodes_on_grid = [antinode for antinode in antinodes if is_in_grid(grid, antinode)]
# for antinode in antinodes_on_grid:
#     grid[antinode[0]][antinode[1]] = '#'
# print_grid(grid)
print(len(antinodes_on_grid))

end = time.time()
print(f'time: {(end - start) * 1000}ms')