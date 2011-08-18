require ''
factors = []
primes = []
nonprimes = []
largest = 0
x = 2
number = 59

begin
if(number%x==0)
factors << x
end
x+=1
end until x > Math.sqrt(number)

puts factors.inspect

for i in factors
for x in 2...i
if((i%x==0)&&(nonprimes.index(i)==nil))
nonprimes << i
puts "#{i.to_s} is a non-prime factor"
end
end
end

primes = factors - nonprimes
puts primes

largest = primes.max


puts "The largest prime factor of 317584931803 is #{largest.to_s}"
