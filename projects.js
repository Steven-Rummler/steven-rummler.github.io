projects = [
  {
    link: "https://kerbal.stevenrummler.com",
    title: "Kerbal Science Analyzer",
    description: "Analyzes game files in browser, displays charts and recommendations",
    tools: ["HTML", "CSS", "JavaScript"]
  },
  {
    link: "https://simplemath.stevenrummler.com",
    title: "Math Flash Cards",
    description: "Generates random simple math problems in flash card format",
    tools: ["HTML", "CSS", "JavaScript"]
  },
  {
    link: "https://starwars.stevenrummler.com/",
    title: "Star Wars Codex",
    description: "Simple website with data display and management",
    tools: ["HTML", "CSS", "JavaScript", "Vue", "Node", "Mongo"]
  },
  {
    link: "https://github.com/Steven-Rummler/FamilyMap",
    title: "Family Map",
    description: "Complete Android application with custom Java backend",
    tools: ["Android", "Java"]
  },
  {
    link: "https://github.com/Steven-Rummler/QualtricsDataCompilation",
    title: "Survey Data Compiler",
    description: "Aggregates results from a group of Qualtrics surveys into summary reports",
    tools: ["Python"]
  },
  {
    link: "https://covid.stevenrummler.com",
    title: "Covid Perspective",
    description: "Covid data showing US states and other countries in the same list",
    tools: ["HTML", "CSS", "JavaScript"]
  }, {
    link: "https://mappings.stevenrummler.com",
    title: "Fabric Mappings",
    description: "Displays useful data about obfuscated Minecraft code as a tool for modders",
    tools: ["HTML", "CSS", "Javascript", "Python", "Flask", "SQLite"]
  }
];

const container = document.getElementById('container');

projects.forEach((project, index) => {
  const panel = document.createElement("a");
  panel.href = project.link;
  panel.classList.add("panel");

  const titleCell = document.createElement("div");
  titleCell.classList.add("cell");
  const titleText = document.createElement("div");
  titleText.classList.add("text");
  titleText.innerText = project.title;
  titleText.classList.add("title");
  titleCell.appendChild(titleText);
  panel.appendChild(titleCell);

  const descriptionCell = document.createElement("div");
  descriptionCell.classList.add("cell");
  const descriptionText = document.createElement("div");
  descriptionText.classList.add("text");
  descriptionText.innerText = project.description;
  descriptionText.classList.add("description");
  descriptionCell.appendChild(descriptionText);
  panel.appendChild(descriptionCell);

  const toolsCell = document.createElement("div");
  toolsCell.classList.add("cell");
  toolsCell.classList.add("tools");
  project.tools.forEach(tool => {
    const toolsText = document.createElement("div");
    toolsText.classList.add("text");
    toolsText.classList.add("tool");
    toolsText.innerText = tool;
    toolsCell.appendChild(toolsText);
  });
  panel.appendChild(toolsCell);

  container.appendChild(panel);
});

function sizeBoxes() {
  const width = window.innerWidth - 42;
  const height = window.innerHeight - 42;
  const windowRatio = width / height;
  const boxesToFit = projects.length;

  const maxBlankSpaces = Math.round(Math.sqrt(boxesToFit));

  const boxCountsToTry = [...Array(maxBlankSpaces + 1).keys()].map(e => e + boxesToFit);

  const grids = [];

  boxCountsToTry.forEach(boxCount => {
    const factors = findFactors(boxCount);
    factors.forEach(factor => {
      const otherSide = boxCount / factor;
      const ratio = factor / otherSide;

      grids.push({
        boxCount,
        factor,
        otherSide,
        ratio,
        offset: Math.abs(ratio - windowRatio)
      })
    })
  });

  const possibleGrids = grids.filter(grid =>
    width / grid.factor > 220 && height / grid.otherSide > 220
  );

  if (possibleGrids.length === 0) {
    if (width > height) {
      possibleGrids.push({
        boxCount: boxesToFit,
        factor: boxesToFit,
        otherSide: 1,
        ratio: boxesToFit,
        offset: 0
      })
    } else {
      possibleGrids.push({
        boxCount: boxesToFit,
        factor: 1,
        otherSide: boxesToFit,
        ratio: 1 / boxesToFit,
        offset: 0
      })
    }
  }

  possibleGrids.sort((a, b) => a.offset - b.offset);

  const bestGrid = possibleGrids[0];


  const boxWidth = width / bestGrid.factor;
  const boxHeight = height / bestGrid.otherSide;

  const wideBoxes = boxWidth > boxHeight;

  if (wideBoxes) {
    const boxes = document.getElementsByClassName('panel');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].style.width = (boxHeight - 25).toString() + 'px';
      boxes[i].style.height = (boxHeight - 25).toString() + 'px';

    }
  } else {
    const boxes = document.getElementsByClassName('panel');
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].style.width = (boxWidth - 25).toString() + 'px';
      boxes[i].style.height = (boxWidth - 25).toString() + 'px';

    }
  }
}

function findFactors(number) {
  const factors = [];
  for (let i = 1; i <= number; i++) {
    if (number % i === 0) factors.push(i);
  }
  return factors;
}

addEventListener('resize', sizeBoxes);

sizeBoxes();