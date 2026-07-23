/* eslint-env browser */
(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
	  const desktopParent = document.querySelector('#desktop-darkmode-parent');
	  const mobileParent = document.querySelector('#mobile-darkmode-parent');
	  const darkmodeComponent = document.querySelector('#darkmode-component');

	  function moveDarkmode() {
		  if (window.innerWidth < 1024) {
			  if (!mobileParent.contains(darkmodeComponent)) {
				  mobileParent.appendChild(darkmodeComponent);
			  }
		  } else {
			  if (!desktopParent.contains(darkmodeComponent)) {
				  desktopParent.appendChild(darkmodeComponent);
			  }
		  }
	  }

	  moveDarkmode();

	  window.addEventListener('resize', moveDarkmode);
  });
})();

function handleDarkMode() {
	return {
		theme: "light",
		toggleTheme(theme) {
			this.theme = theme;
			this.setCookie("theme", theme, 30);
			this.applyTheme();
		},
		applyTheme() {
			const html = document.documentElement;
			if (this.theme === "dark") {
				html.classList.add("dark");
			} else {
				html.classList.remove("dark");
			}
		},
		setCookie(name, value, days) {
			const expires = new Date(Date.now() + days * 864e5).toUTCString();
			document.cookie = `${name}=${value}; expires=${expires}; path=/`;
		},

		getCookie(name) {
			return document.cookie.split("; ").reduce((r, v) => {
				const parts = v.split("=");
				return parts[0] === name ? decodeURIComponent(parts[1]) : r;
			}, "");
		},
		init() {
			const savedTheme = this.getCookie("theme");
			if (savedTheme) {
				this.theme = savedTheme;
			} else {
				this.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			}

			this.applyTheme();
		},
	}
}

function handleMenu() {
	return {
		smMenuVisible: false,
		activeParent: "",
		isScrolled: false,
		isSearchOpen: false,
		searchList: [1,2,3,4],
		searching: false,
		searchInput: "",
		toggleSmMenu() {
			if(this.smMenuVisible) {
				this.smMenuVisible = false;
				this.activeParent = "";
			} else {
				this.smMenuVisible = true;
			}
		},
		openParentSm(target) {
			if(window.innerWidth < 1024) {
				if(this.activeParent === target) {
					this.activeParent = "";
				} else {
					this.activeParent = target;
				}
			}
		},
		openParentLg(target) {
			if(window.innerWidth >= 1024) {
				this.activeParent = target;
			}
		},
		closeParentLg() {
			if(window.innerWidth >= 1024) {
				this.activeParent = "";
			}
		},
		checkScroll() {
			const y = window.scrollY;
			if (!this.isScrolled && y > 210) {
				this.isScrolled = true;
			} else if (this.isScrolled && y < 150) {
				this.isScrolled = false;
			}
		},
		openSearch() {
			this.isSearchOpen = true;
			fixBody();
		},
		closeSearch() {
			this.isSearchOpen = false;
			unfixBody();
		},
		closeDesktopSearch() {
			if(window.innerWidth >= 1024) {
				if(this.isSearchOpen) {
					this.closeSearch();
				}
			}
		},
		init() {
			this.checkScroll();

			window.addEventListener("scroll", () => {
				this.checkScroll();
			});
		}
	}
}
