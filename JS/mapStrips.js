//
//	COPYRIGHT NIGHTHAWK 2024 - 2025. ALL RIGHTS RESERVED.
//	PROGRAMMED BY: JESUS BARAJAS (AKA MXNIGHTHAWK / NIGHTHAWK / NIGHTHAWKDEV / NAUGHTYSNEAK)
//

let maximumHeight = 0;
let sizeTimings = {
	duration: 200,
	iterations: 1,
	easing: "ease",
	fill: "forwards"
};

class Step
{
	priceTag;
	pieceType;
	fillPercent;

	constructor(orderTiles, price, type, makeRow, includedInRow, completion)
	{
		this.priceTag = price;
		this.pieceType = type;
		this.fillPercent = completion;

		let tileContainer = orderTiles.getElementsByClassName("orderTiles")[0];
		let destiation = tileContainer;
		let colorPart = 200 + 55 * Math.pow(completion / 100, 2);

		let row = document.createElement('div');
		row.classList.add("tileRow");

		if(makeRow)
			tileContainer.appendChild(row);
		
		if(includedInRow != undefined)
			destiation = tileContainer.getElementsByClassName("tileRow")[includedInRow];
		
		let tile = document.createElement('div');
		let fill = document.createElement('div');
		let desc = document.createElement('p');

		tile.classList.add("orderTile");
		tile.style.color = "";

		fill.classList.add("fill");
		fill.style.width = `${100 - completion}%`;

		desc.style.color = `rgb(${colorPart}, ${colorPart}, ${colorPart}`;
		desc.innerText = `${this.priceTag > 0 ? `$${this.priceTag.toFixed(2)},`: ""} ${this.pieceType}`;
		
		destiation.appendChild(tile);
		tile.appendChild(fill);
		tile.appendChild(desc);
	}
}
class OrderStrip
{
	name;
	tag;
	
	#self;
	#target = 0;
	#orignalHeight;
	#canBeClicked;

	#totalPrice = 0;
	#totalProgress = 0;

	orders = [];
	
	expandFrames;
	minimizeFrames;

	constructor(element, dateShift, metaData)
	{
		this.#self = element;
		this.name = metaData[0];
		this.tag = metaData[3];
		this.orders = metaData[4];

		const eta = this.#self.getElementsByClassName("userETA")[0];
		eta.getElementsByClassName("username")[0].innerText = this.name;
		eta.getElementsByClassName("eta")[0].innerText = `ETA: ${metaData[1]} ${metaData[2]}`;
		this.#self.getElementsByClassName("pricePaid")[0].innerHTML = `$999`;

		this.SetClickableState(true);
		this.#self.addEventListener("click", () =>
		{
			if(!this.#canBeClicked)
				return;

			if(this.#target == 0)
			{
				this.#target = 1;
				this.#self.style.borderRadius = "2px 2px 0px 0px";
			}
			else
			{
				this.#target = 0;
				this.#self.style.borderRadius = "2px";
			}
			
			this.#self.animate(this.#target == 1? this.expandFrames : this.minimizeFrames, sizeTimings);
		});

		for (let i = 0; i < this.orders.length; i++) {
			const element = this.orders[i];

			this.#totalPrice += element.priceTag;
			this.#totalProgress += element.fillPercent;
		}
		
		eta.getElementsByClassName("fill")[0].style.setProperty("width", `${100 - this.#totalProgress / this.orders.length}%`);
		this.#self.getElementsByClassName("pricePaid")[0].innerHTML = `$${this.#totalPrice}`;
		this.#self.style.width = `${316 + (164 * (metaData[2] == "Hours" || metaData[2] == "Hour" ? 0 : metaData[1] - 1))}px`;
		this.#self.style.setProperty("--leftShift", dateShift);

		let col = 0;
		switch (this.tag) {
			case "focused":
				col = 104;
				break;
			case "delayed":
				col = 15;
				break;
			default:
				col = 220;
				break;
		}

		this.#self.style.setProperty("--colorRotation", col);
	}

	MinimizePrep()
	{
		this.#orignalHeight = this.#self.clientHeight;
		
		this.expandFrames = [
			{
				height: "35px"
			},
			{
				height: `${this.#orignalHeight}px`
			}
		];
		this.minimizeFrames = [
			{
				height: `${this.#orignalHeight}px`
			},
			{
				height: "35px"
			}
		];

		this.#self.animate(this.minimizeFrames, sizeTimings);
	}

	SetClickableState(state)
	{
		this.#canBeClicked = state;
		this.#self.style.opacity = state ? "1" : "0.25";
		this.#self.style.cursor = this.#canBeClicked ? "pointer" : "default";
	}
}

let order = document.getElementsByClassName("order");
let stripParent = document.getElementById("orderStrips");

// stripParent.style.setProperty("--leftShift", 4);

let orderStrips =
[
	new OrderStrip(order[0], 0,
	["MxNighthawk - Colored Head", 7, "Days", "delayed", 
		[
			new Step(order[0], 5, "Sketch Installment", true, 0, 100),
			new Step(order[0], 0, "Sketch Progress", false, 0, 25),
			new Step(order[0], 5, "Lineart Installment", true, 1, 0),
			new Step(order[0], 0, "Lineart Progress", false, 1, 0),
			new Step(order[0], 5, "Color Installment", true, 2, 0),
			new Step(order[0], 0, "Color Progress", false, 2, 0),
		]
	]),
	new OrderStrip(order[1], 0,
	["Authurenglebert - Lineart Full Body", 7, "Days", "delayed", 
		[
			new Step(order[1], 22.5, "Sketch Installment", true, 0, 100),
			new Step(order[1], 0, "Sketch Progress", false, 0, 75),
			new Step(order[1], 22.5, "Lineart Installment", true, 1, 0),
			new Step(order[1], 0, "Lineart Progress", false, 1, 0),
		]
	]),
	new OrderStrip(order[2], 0,
	["Bloomako - Rendered Full Body", 21, "Days", "delayed", 
		[
			new Step(order[2], 18.75, "Sketch Installment", true, 0, 0),
			new Step(order[2], 0, "Sketch Progress", false, 0, 0),
			new Step(order[2], 18.75, "Lineart Installment", true, 1, 0),
			new Step(order[2], 0, "Lineart Progress", false, 1, 0),
			new Step(order[2], 18.75, "Color Installment", true, 2, 0),
			new Step(order[2], 0, "Color Progress", false, 2, 0),
			new Step(order[2], 18.75, "Render Installment", true, 2, 0),
			new Step(order[2], 0, "Render Progress", false, 2, 0),
		]
	]),
];
let focused = [], delayed = [], queued = [];
