
#each method overwritten.
class Array
  def each(&arg)
    for i in 0...self.length
      arg.call(self[i])
    end
  end
end

class Person
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def getMeAllMoney
    sum
  end
end

#people = [Person.new("Rup"), Person.new("Nir"), Person.new("Sang"), Person.new("Ama")]
#people.each { |x| puts x.name }
#
#arr =[2, 3, 4, 5]
#arr.each { |a| puts a.to_s }
#
#strArr = "you are my best buddy".split(/\s+/)
#strArr.each{ |a| puts a.to_s}

puts Person.methods

