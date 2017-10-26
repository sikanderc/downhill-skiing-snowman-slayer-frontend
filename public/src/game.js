
class Game {
  constructor() {
    this.canvas = document.createElement("canvas")
    this.canvas.width = 480;
    this.canvas.height = 540;
    this.context = this.canvas.getContext("2d");


    this.updateGameArea = this.updateGameArea.bind(this)
  }

  start() {
    document.body.insertBefore(this.canvas, document.body.childNodes[0])
    this.frameNo = 0;
    this.background = new Component(480, 540, "", 0, 0, "background", this);
    this.skier = new Skier(40, 40, "images/Skier.png", 220, 480, "image", this);
    this.score = new Component("20px", "Consolas", "blue", 340, 40, "text", this);
    this.snowmenScore = new Component("20px", "Consolas", "blue", 340, 80, "text", this);
    this.gameSpeed = 10;
    this.interval = setInterval(this.updateGameArea, this.gameSpeed)
    this.snowmen = [];
    this.trees = [];
    this.logs = [];
    this.snowballs = [];
    this.rubies = []
    this.snowmenHit = 0;
    this.spawnPosition = 0;
    this.spawnPositions = [ 0, 50, 100, 150, 200, 250, 300, 350, 400, 450 ];
    this.snowballDelay = 400;

    this.addKeyPressListeners();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  stop() {
    clearInterval(this.interval);
  }

  updateGameArea() {
    this.frameNo++
    this.clear()

    this.skier.updateSkierDirection();
    this.skier.checkForSnowballThrow();

    this.background.speedY = 1;
    this.background.newPos();
    this.background.update();

    this.snowballs.forEach(snowball => {
      snowball.y -= 5
      snowball.update()
    })


    let newSnowmen = this.snowmanCreator(1.02)
    this.snowmen = [...this.snowmen, ...newSnowmen]

    let newTrees = this.treeCreator(1.01)
    this.trees = [...this.trees, ...newTrees]

    let newLogs = this.logCreator(1.005)
    this.logs = [...this.logs, ...newLogs]

    let newRubies = this.rubyCreator(1.0005)
    this.rubies = [...this.rubies, ...newRubies]

    this.detectCollisions()

    this.detectLogCollisions()

    this.detectRubyCollisions()

    this.score.text="SCORE: " + this.frameNo;
    this.score.update();

    this.snowmenScore.text="Snowmen: " + this.snowmenHit;
    this.snowmenScore.update()

    this.snowmen.forEach(snowman => {
      // let snowmanNum = parseInt(snowman.image.src[14])
      // if (snowmanNum < 16) {
      //   snowmanNum++
      //   debugger
      //   snowman.image.src = `images/Snowman${Math.floor(snowmanNum/4)}.png`
      // } else {
      //   snowmanNum = 4
      //   snowman.image.src = `images/Snowman${Math.floor(snowmanNum/4)}.png`
      // }

      snowman.y += 1
      snowman.update()
    })

    this.detectTreeCollisions()

    this.skier.newPos();
    this.skier.update();

    this.score.text="SCORE: " + this.frameNo;
    this.score.update();

    this.snowmenScore.text="Snowmen: " + this.snowmenHit;
    this.snowmenScore.update()
  }

  addKeyPressListeners() {
    // let check = true;
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      // if (e.which === 32 && check === true) {
      //
      //   let snowball = new Component(9, 15, "images/Snowball.png", this.skier.x + 30, this.skier.y + 20, "image", this);
      //   this.skier.image.src = "images/ForwardThrow/SkierForwardThrow6.png";
      //   this.snowballs.push(snowball);
      //
      //   check = false;
      //   setTimeout(()=>{check = true},this.snowballDelay)

      // } else {
        this.keys = (this.keys || []);
        this.keys[e.keyCode] = (e.type === 'keydown');
      // }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.keyCode] = (e.type === 'keydown');
      this.clearMove();
    });
  }

  clearMove() {
    this.skier.image.src = "images/Skier.png";
  }

  incrementSpawn() {
    if (this.spawnPosition < (this.spawnPositions.length - 1)) {
      this.spawnPosition++
    } else {
      this.spawnPosition = 0
      for (let i = this.spawnPositions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this.spawnPositions[i];
        this.spawnPositions[i] = this.spawnPositions[j];
        this.spawnPositions[j] = temp;
    }
    }
  }

  snowmanCreator(difficulty) {
    let num = Math.floor(Math.random() * difficulty);
    let newSnowmen = [];
    for (let i = 0; i < num; i++) {
      newSnowmen.push(new Component(40, 60, `images/Snowman${Math.floor(Math.random() * 3 + 1)}.png`, this.spawnPositions[this.spawnPosition], -60, "image", this));
      this.incrementSpawn()
      // newSnowmen.push(new Component(40, 60, "images/Snowman1.png", Math.floor(Math.random() * this.background.width), -60, "image", this));
    }
    return newSnowmen;
  }

  treeCreator(difficulty) {
    let num = Math.floor(Math.random() * difficulty);
    let newTrees = [];
    for (let i = 0; i < num; i++) {
      newTrees.push(new Component(40, 60, "images/Tree.png", this.spawnPositions[this.spawnPosition], -60, "image", this));
      this.incrementSpawn()
    }
    return newTrees;
  }

  logCreator(difficulty) {
    let num = Math.floor(Math.random() * difficulty);
    let newLogs = [];
    for (let i = 0; i < num; i++) {
      newLogs.push(new Component(50, 10, "images/Log.png", this.spawnPositions[this.spawnPosition], -60, "image", this));
      this.incrementSpawn()
    }
    return newLogs;
  }

  rubyCreator(difficulty) {
    let num = Math.floor(Math.random() * difficulty);
    let newRubies = [];
    for (let i = 0; i < num; i++) {
      newRubies.push(new Component(15, 15, "images/rubyGem.png", this.spawnPositions[this.spawnPosition], -60, "image", this));
      this.incrementSpawn()
    }
    return newRubies;
  }

  detectCollisions() {
    this.snowmen = this.snowmen.filter(snowman => {
      snowman.speedY = 1;
      snowman.newPos()
      snowman.update()

      this.detectSnowballCollision(snowman, "snowman")
      this.detectSkierCollision(snowman, "snowman");
      this.detectSnowmanTreeCollision(snowman)

      // snowman.y > this.background.height ? false : true
      if (snowman.y > this.background.height) {
        // snowman = null
        return false
      } else {
        return true
      }
    })
  }

  detectTreeCollisions() {
    this.trees = this.trees.filter(tree => {
      tree.speedY = 1;
      tree.newPos()
      tree.update()

      this.detectSnowballCollision(tree, "tree")
      this.detectSkierCollision(tree, "tree");


      // tree.y > this.background.height ? false : true
      if (tree.y > this.background.height) {
        // tree = null
        return false
      } else {
        return true
      }
    })
  }

  detectSnowmanTreeCollision(snowman) {
    let check;
    this.trees.forEach(tree => {
      let withinY = (snowman.y <= (tree.y + tree.height) && snowman.y >= tree.y)
      let upperLeftwithinX = (snowman.x >= tree.x && snowman.x <= (tree.x + tree.width))
      let upperRightwithinX = (snowman.x + snowman.width) >= tree.x && (snowman.x + snowman.width) <= (tree.x + tree.width)

      if (withinY && (upperLeftwithinX || upperRightwithinX)) {
          snowman.image.src = "images/SnowmanDeath2.png"
          snowman.y -= 1;
          setTimeout(function(){
            snowman.height = 0
            snowman.width = 0
          }, 100)
          check = false;
      } else {
        check = true;
      }
    })
    return check;
  }

  detectLogCollisions() {
    this.logs = this.logs.filter(log => {
      log.speedY = 1;
      log.newPos()
      log.update()

      this.detectSkierCollision(log, "log");

      // log.y > this.background.height ? false : true

      if (log.y > this.background.height) {
        // log = null
        return false
      } else {
        return true
      }
    })
  }

  detectRubyCollisions() {
    this.rubies = this.rubies.filter(ruby => {
      ruby.speedY = 1;
      ruby.newPos()
      ruby.update()

      this.detectSkierCollision(ruby, "ruby");

      // ruby.y > this.background.height ? false : true

      if (ruby.y > this.background.height) {
        // ruby = null
        return false
      } else {
        return true
      }
    })
  }

  detectSnowballCollision(component, type) {
    this.snowballs = this.snowballs.filter(snowball => {

      let withinY = (snowball.y <= (component.y + component.height) && snowball.y >= component.y)
      let upperLeftwithinX = (snowball.x >= component.x && snowball.x <= (component.x + component.width))
      let upperRightwithinX = (snowball.x + snowball.width) >= component.x && (snowball.x + snowball.width) <= (component.x + component.width)

      if (withinY && (upperLeftwithinX || upperRightwithinX)) {
        if (type === "snowman") {
          component.image.src = "images/SnowmanDeath2.png"
          setTimeout(function(){
            component.height = 0
            component.width = 0
          }, 100)
          this.snowmenHit++
          return false
        } else if (type === "tree") {
          return false
        }
      }
      if (snowball.y < 0) {
        return false
      } else {
        return true
      }
    });
  }

  detectSkierCollision(component, type) {
    let withinY = ((this.skier.y + 12) <= (component.y + component.height) && (this.skier.y + 12) >= component.y)
    let upperLeftwithinX = ((this.skier.x + 14) >= component.x && (this.skier.x + 14) <= (component.x + component.width))
    let upperRightwithinX = (this.skier.x + this.skier.width - 14) >= component.x && (this.skier.x + this.skier.width - 14) <= (component.x + component.width)

    if (withinY && (upperLeftwithinX || upperRightwithinX)) {
      if (type === "snowman") {
        this.endGame();
      } else if (type === "tree") {
        this.endGame();
      } else if (type === "log") {
        if (!this.keys[38]) {
          this.endGame();
        }
      }else if (type === "ruby") {
        this.snowballDelay = (this.snowballDelay/2)
        setTimeout(()=> {
          component.height = 0
          component.width = 0
        }, 100)
        setTimeout(() => {
          this.snowballDelay = (this.snowballDelay * 2)
        }, 10000)
        //NEED TO CHANGE SKIER IMAGE
      }
    }
  }

  endGame() {
    this.stop();
    App.displayEndMenu(this.frameNo, this.snowmenHit);
  };
}
