
//
function buildSheet(contentElements, config = {}) {

	const defaultConfig = {
		size: 'content', // content, full,
		blockBg: false, // if true, obscure background with overlay
		dragCloseEnable: true,
		heading: '',
		description: '',
		iconLeft: {
			label: 'back', // from https://fonts.google.com/icons
			onClick: () => {}, // close sheet and callback
			customClassList: [],
		},
		iconRight: {
			label: 'close', // from https://fonts.google.com/icons
			onClick: () => {}, // close sheet and callback
			customClassList: [],
		},
		ctaPrimary: { 
			label: '', 
			onClick: () => {}, // close sheet and callback
			customClassList: [],
		},
		ctaSecondary: {
			label: '',
			onClick: () => {}, // close sheet and callback
			customClassList: [],
		},
		progress: {
			mode: '', // int (definite), inf (indefinite)
		},
		onClose: (sheet) => console.warn('sheet closed', sheet)
	};

	const sheet = document.createElement("div");
	sheet.innerHTML = `
	<div class="sheet-header">

		<div class="sheet-drag"></div>

		<div class="sheet-header-content">

			<div class="sheet-icon-left">
				<span class="material-symbols-outlined">
					back
				</span>
			</div>

			<div class="sheet-info">
				<div class="sheet-title"></div>
				<div class="sheet-description"></div>
			</div>

			<div class="sheet-icon-right">
				<span class="material-symbols-outlined">
					close
				</span>
			</div>


		</div>

		<div class="sheet-progress"></div>

	</div>

	<div class="content-container"></div>

	<div class="sheet-footer">
		<div class="cta-primary"></div>
		<div class="cta-secondary"></div>
	</div>
  	`;

	sheet.dataset.isOpen = "false"; // for css animation
	sheet.classList.add("sheet");

	// compare defaultConfig with config, and add only those that are in config
	
	sheet.classList.add("sheet", config.size ? config.size : defaultConfig.size);
	sheet.dataset.blockBg = config.blockBg ? "true" : "false";

	if (config.heading) {
		sheet.querySelector('.sheet-title').innerText = config.heading;
	} else {
		sheet.querySelector('.sheet-title').parentElement.removeChild(
			sheet.querySelector('.sheet-title')
		)
	}

	if (config.description) {
		sheet.querySelector('.sheet-description').innerText = config.description;
	} else {
		sheet.querySelector('.sheet-description').parentElement.removeChild(
			sheet.querySelector('.sheet-description')
		)
	}

	if (config.iconLeft) {
		sheet.querySelector('.sheet-icon-left .material-symbols-outlined')
			.innerText = config.iconLeft.label ? 
				config.iconLeft.label :
				defaultConfig.iconLeft.label;
		
		sheet.querySelector('.sheet-icon-left').classList.add(...(
			config.iconLeft.customClassList ?
				config.iconLeft.customClassList :
				defaultConfig.iconLeft.customClassList
		));

		sheet.querySelector('.sheet-icon-left').addEventListener('click', () => {
			// close sheet
			//sheet.close();
			// callback
			config.iconLeft.onClick ? 
				config.iconLeft.onClick(sheet) :
				defaultConfig.iconLeft.onClick(sheet);
		});

	} else {
		sheet.querySelector('.sheet-icon-left').parentElement.removeChild(
			sheet.querySelector('.sheet-icon-left')
		)
	}

	if (config.iconRight) {
		sheet.querySelector('.sheet-icon-right .material-symbols-outlined')
			.innerText = config.iconRight.label ? 
				config.iconRight.label :
				defaultConfig.iconRight.label;
		
		sheet.querySelector('.sheet-icon-right').classList.add(...(
			config.iconRight.customClassList ?
				config.iconRight.customClassList :
				defaultConfig.iconRight.customClassList
		));

		sheet.querySelector('.sheet-icon-right').addEventListener('click', () => {
			// close sheet
			//sheet.close();
			// callback
			config.iconRight.onClick ? 
				config.iconRight.onClick(sheet) :
				defaultConfig.iconRight.onClick(sheet);
		});
	} else {
		sheet.querySelector('.sheet-icon-right').parentElement.removeChild(
			sheet.querySelector('.sheet-icon-right')
		)
	}

	if (config.ctaPrimary) {
		sheet.querySelector('.cta-primary')
			.innerText = config.ctaPrimary.label ? 
				config.ctaPrimary.label :
				defaultConfig.ctaPrimary.label;
		
		sheet.querySelector('.cta-primary').classList.add(...(
			config.ctaPrimary.customClassList ?
				config.ctaPrimary.customClassList :
				defaultConfig.ctaPrimary.customClassList
		));

		sheet.querySelector('.cta-primary').addEventListener('click', () => {
			// close sheet
			//sheet.close();
			// callback
			config.ctaPrimary.onClick ? 
				config.ctaPrimary.onClick(sheet) :
				defaultConfig.ctaPrimary.onClick(sheet);
		});
	} else {
		sheet.querySelector('.cta-primary').parentElement.removeChild(
			sheet.querySelector('.cta-primary')
		)
	}

	if (config.ctaSecondary) {
		sheet.querySelector('.cta-secondary')
			.innerText = config.ctaSecondary.label ? 
				config.ctaSecondary.label :
				defaultConfig.ctaSecondary.label;
		
		sheet.querySelector('.cta-secondary').classList.add(...(
			config.ctaSecondary.customClassList ?
				config.ctaSecondary.customClassList :
				defaultConfig.ctaSecondary.customClassList
		));

		sheet.querySelector('.cta-secondary').addEventListener('click', () => {
			// close sheet
			//sheet.close();
			// callback
			config.ctaSecondary.onClick ? 
				config.ctaSecondary.onClick(sheet) :
				defaultConfig.ctaSecondary.onClick(sheet);
		});
	} else {
		sheet.querySelector('.cta-secondary').parentElement.removeChild(
			sheet.querySelector('.cta-secondary')
		)
	}

	if(config.progress) {
		// width
		// mode
		// add callback to update or end progress

		sheet.querySelector('.sheet-progress')
			.dataset.mode = config.progress.mode ? 
				config.progress.mode : 
				defaultConfig.progress.mode;
		
		// add update callback, if the set progress is 1 then end it
		sheet.setProgress = (progress) => {
			if(progress == 1) return sheet.querySelector('.sheet-progress').parentElement.removeChild(
				sheet.querySelector('.sheet-progress')
			);

			sheet.querySelector('.sheet-progress').style.setProperty('--progress', progress);

		}

	} else {
		sheet.querySelector('.sheet-progress').parentElement.removeChild(
			sheet.querySelector('.sheet-progress')
		)
	}

	if(config.hasOwnProperty('dragCloseEnable')) {
		config.dragCloseEnable ?
		onDrag(sheet.querySelector(".sheet-drag"), () => {
			sheet.close();
			config.onClose ? config.onClose(sheet) : defaultConfig.onClose(sheet);
		}) :
		sheet.querySelector(".sheet-drag").parentElement.removeChild(
			sheet.querySelector(".sheet-drag")
		);
	} else if(defaultConfig.dragCloseEnable) {
		onDrag(sheet.querySelector(".sheet-drag"), () => {
			sheet.close();
			config.onClose ? config.onClose(sheet) : defaultConfig.onClose(sheet);
		});
	} else {
		sheet.querySelector(".sheet-drag").parentElement.removeChild(
			sheet.querySelector(".sheet-drag")
		);
	}

	// add elements
	contentElements.forEach((element) =>
		sheet.querySelector(".content-container").appendChild(element)
	);

	// open, close, update content

	sheet.open = (selector = "body") => {
		// append the sheet in the DOM
		document.querySelector(selector).appendChild(sheet);

		// css open animation
		sheet.dataset.isOpen = "true";

		return sheet;
	};

	sheet.close = () => {
		// delay in ms
		const delayTime = Number(
			window
				.getComputedStyle(sheet)
				.getPropertyValue("--sheet-delay")
				.match(/\d+/)[0]
		);

		// css close animation
		sheet.dataset.isOpen = "false";

		// wait for closing animation, and then remove it
		setTimeout(() => {
			document.body.querySelector("main").removeChild(sheet);
			onCloseCallback();
		}, delayTime);

	};

	sheet.update = (newElements) => {
		// remove all elements
		sheet.querySelector(".content-container").innerHTML = "";

		// add new elements
		newElements.forEach((element) =>
			sheet.querySelector(".content-container").appendChild(element)
		);
		
		return sheet;
	}

	return sheet;
}
