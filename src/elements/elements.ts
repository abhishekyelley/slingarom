const resetBtn: HTMLElement | null = document.querySelector("#resetBtn");
const myCanvas: HTMLCanvasElement | null = document.querySelector("#myCanvas");
const scoreField: HTMLElement | null = document.querySelector("#score");
const movesField: HTMLElement | null = document.querySelector("#moves");
const mainHeading: HTMLElement | null = document.querySelector("#mainHeading");
const muteBtn: HTMLElement | null = document.querySelector("#muteBtn");
const menuBtn: HTMLElement | null = document.querySelector("#menuBtn");
const menuItems: HTMLElement | null = document.querySelector("#menuItems");
const gameConfigForm: HTMLFormElement | null = document.querySelector("#gameConfigForm");
const applyBtn: HTMLElement | null = document.querySelector("#applyBtn");
const restoreBtn: HTMLElement | null = document.querySelector("#restoreBtn");
const randomizeBtn: HTMLElement | null = document.querySelector("#randomizeBtn");

const ballRadiusInput: HTMLInputElement | null = document.querySelector("#ballRadiusInput");
const gravityInput: HTMLInputElement | null = document.querySelector("#gravityInput");
const frictionInput: HTMLInputElement | null = document.querySelector("#frictionInput");
const speedFactorInput: HTMLInputElement | null = document.querySelector("#speedFactorInput");
const totalFoodInput: HTMLInputElement | null = document.querySelector("#totalFoodInput");
const boundRadiusInput: HTMLInputElement | null = document.querySelector("#boundRadiusInput");
const isBackgroundImage: HTMLInputElement | null = document.querySelector("#isBackgroundImage");

export default{
    resetBtn,
    myCanvas,
    movesField,
    scoreField,
    mainHeading,
    muteBtn,
    menuBtn,
    menuItems,
    gameConfigForm,
    applyBtn,
    restoreBtn,
    randomizeBtn,

    ballRadiusInput,
    gravityInput,
    frictionInput,
    speedFactorInput,
    totalFoodInput,
    boundRadiusInput,
    isBackgroundImage,
};