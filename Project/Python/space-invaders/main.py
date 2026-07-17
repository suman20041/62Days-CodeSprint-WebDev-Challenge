# SPACE INVADERS
# Author: Yashwini
# 17-09-2022
# 20-09-2022
# 23-09-2022
import math
import turtle
import winsound

# set up the screen
window_screen = turtle.Screen()
window_screen.bgcolor("black")
window_screen.title("Space Invaders")
window_screen.bgpic("space_invaders_bg.gif")
window_screen.tracer(0)

# register shapes
window_screen.register_shape("enemy.gif")
window_screen.register_shape("player.gif")

# draw border
border_pen = turtle.Turtle()
border_pen.speed(0)  # 0 is the fastest
border_pen.color("white")
border_pen.penup()
border_pen.setposition(-250, -250)
border_pen.pendown()
border_pen.pensize(3)
for i in range(4):
    border_pen.fd(500)
    border_pen.lt(90)
border_pen.hideturtle()

# set score to 0
score = 0

score_pen = turtle.Turtle()
score_pen.speed(0)
score_pen.color("white")
score_pen.penup()
score_pen.setposition(-235, 220)
score_string = "Score: {}".format(score)
score_pen.write(score_string, False, align="left", font=("Arial", 10, "normal"))
score_pen.hideturtle()

# create player
player = turtle.Turtle()
player.color("purple")
player.shape("player.gif")
player.penup()
player.speed(0)
player.setposition(0, -220)
player.setheading(90)
player.speed = 0

# choose num of enemies
n_enemies = 21
# create an empty list of enemies
enemies = []

enemy_startx = -150
enemy_starty = 200
enemy_number = 0

# add enemies to the list
for i in range(n_enemies):
    # create the enemy
    enemy = turtle.Turtle()
    enemy.color("red")
    enemy.shape("enemy.gif")
    enemy.penup()
    enemy.speed(0)
    x = enemy_startx + (50 * enemy_number)
    y = enemy_starty
    enemy_number += 1
    enemy.setposition(x, y)
    enemy.setheading(-90)

    enemies.append(enemy)

    if enemy_number == 7:
        enemy_starty -= 50
        enemy_number = 0

enemyspeed = 0.3

# create bullet
bullet = turtle.Turtle()
bullet.color("yellow")
bullet.penup()
bullet.speed(0)
bullet.shapesize(0.7)
bullet.setheading(90)
bullet.hideturtle()

bulletspeed = 3

# define bullet state
# ready - ready to fire
# fire - bullet is firing
bulletstate = "ready"


# Move the player left or right
def move_left():
    player.speed = -1.5


def move_right():
    player.speed = 1.5


def move_player():
    x = player.xcor() + player.speed
    if x < -220:
        x = -220
    if x > 220:
        x = 220
    player.setx(x)


def fire_bullet():
    # declare bulletstate as global as it needs to be changed
    global bulletstate

    if bulletstate == "ready":
        winsound.PlaySound("laser.wav", winsound.SND_ASYNC)
        bulletstate = "fire"
        # move the bullet just above the player
        bullet.setposition(player.xcor(), player.ycor() + 7)
        bullet.showturtle()


def is_collision(t1, t2):
    distance = math.sqrt(math.pow(t1.xcor() - t2.xcor(), 2) + math.pow(t1.ycor() - t2.ycor(), 2))
    if distance < 18:
        return True
    else:
        return False


# create keyboard bindings
window_screen.listen()
window_screen.onkeypress(move_left, "Left")
window_screen.onkeypress(move_right, "Right")
window_screen.onkeypress(fire_bullet, "space")

game_over = 0

# main game loop
while True:
    window_screen.update()
    move_player()

    for enemy in enemies:
        # move the enemy
        enemy.setx(enemy.xcor() + enemyspeed)

        # reverse the enemies and move down
        if enemy.xcor() > 230 or enemy.xcor() < -230:
            for e in enemies:
                e.sety(e.ycor() - 20)
            enemyspeed *= -1

        # check for a collision between the enemy and the bullet
        if is_collision(bullet, enemy):
            winsound.PlaySound("explosion.wav", winsound.SND_ASYNC)
            # reset the bullet
            bulletstate = "ready"
            bullet.hideturtle()
            bullet.setposition(0, -400)

            # reset the enemy
            enemy.setposition(0, 5000)

            # update score
            score += 10
            score_string = "Score: {}".format(score)
            score_pen.clear()
            score_pen.write(score_string, False, align="left", font=("Arial", 10, "normal"))

        if abs(enemy.ycor() - player.ycor()) < 60:
            winsound.PlaySound("explosion.wav", winsound.SND_ASYNC)
            game_over = 1
            player.hideturtle()
            enemy.hideturtle()
            print("GAME OVER!! BETTER LUCK NEXT TIME :/")
            break

    # move the bullet
    if bulletstate == "fire":
        bullet.sety(bullet.ycor() + bulletspeed)

    # if the bullet reached the top
    if bullet.ycor() > 250:
        bulletstate = "ready"
        bullet.hideturtle()

    if game_over:
        break