let a = 1 // global scope

function outer() {
  let b = 2 // outer function scope
  console.log(b)

  function inner() {
    let c = 3 // inner function scope
    // console.log(a, b, c);
    console.log(c)
  }

  inner()
}
console.log(a)
outer()
console.log(a)
