var canJump = function (nums) {
    let numberOfSteps = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > numberOfSteps) return false;
        numberOfSteps = Math.max(numberOfSteps, i + nums[i]);
        if(numberOfSteps >= nums.length) return true;
    }
};

console.log(canJump([3,2,1,1,4]));