/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums= [0,0,1,1,1,1,2,3,3]) {
  let i = 0, occurrence = 1;
  while(i < nums.length) {
     if(nums[i] === nums[i+1]) {
       occurrence++;
     }

     if(nums[i] !== nums[i+1]) {
       if(occurrence > 2) {
         const start = (i + 1) - occurrence;
         nums.splice(start, occurrence - 2);
         i = start + 1;
       }
       occurrence = 1;
     }

     i++;
  }
};

console.log(removeDuplicates());
