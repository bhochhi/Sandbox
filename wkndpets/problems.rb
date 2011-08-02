class Problems
  # Problem 1. Find the sum of all the multiples of 3 or 5 below 1000?
  def sumOfMultiplesOf3Or5BelowGivenNumber(num)
    sum = 0
    multiplier =[]
    for i in 1...num
      if (i%3==0 or i%5 ==0) and !multiplier.include?(i)
        sum +=i
        multiplier<<i
      end
    end
    sum
  end

    # Problem 1. Find the sum of all the multiples of 3 or 5 below 1000?
  def sumOfMultiplesOf3Or5BelowGivenNumberAlt(num)
    threes = 0
    fives = 0
    fifteens = 0
    0.step(num-1, 3) { |x| threes+=x }
    0.step(num-1, 5) { |x| fives+=x }
    0.step(num-1, 15) { |x| fifteens+=x }
    threes + fives - fifteens
  end

    #problem 2. By considering the terms in the Fibonacci sequence whose values do not exceed four million, find the sum of the even-valued terms.
  def sumOfEvenOfFibonacciBelowGivenNumber(num)
    x, y =1, 2
    sum =0
    while y<=num
      sum+=y if (y%2==0)
      tempX =x
      x, y=y, tempX+y
    end
    sum
  end
  #problem 3. What is the largest prime factor of the number 600851475143 ?
  def getLargestPrimeFactorOfGivenNumber(num)

  end
end
#puts Problems.new.sumOfMultiplesOf3Or5BelowGivenNumberAlt(1000)
#puts Problems.new.sumOfMultiplesOf3Or5BelowGivenNumber(1000)
puts Problems.new.sumOfEvenOfFibonacciBelowGivenNumber(4000000)
