require 'net/http'
require "json"
class TweetScrapper
  def displayTweets(searchWord)

  end

  def searchTweetsWithURIs(searchWord)

  end

  def searchTweetsWithRedirectedURIs(searchWord)

  end

  def displayYoutubeLinks(searchWord)
    url = 'http://search.twitter.com/search.json?q='+searchWord
    data = Net::HTTP.get_response(URI.parse(url)).body
    result = JSON.parse(data)
    printf "Total no. of Tweets found:#{result['results'].length}\n"
    result['results'].each { |key|
      if key['text'].include? "http:"
        key['text'].split(" ").each { |possible_url|
          if possible_url=~/http:/
            resp = Net::HTTP.get_response(URI.parse(possible_url))
              #Displaying URI  only if they are Redirected
            if resp.code.eql?("301")
              begin
                puts "Original Url: #{possible_url}"
                redirectedUrl = resp["location"]
                puts "Redirected Url: #{redirectedUrl}"
                  # Checking if Redirected URL is for youtube domain
                puts "THIS IS YouTube" if URI.parse(redirectedUrl).host.include?("youtube")
              rescue
                puts possible_url + "couldn't be parsed correctly"
              end
            end
          end
        }
      end
    }
  end
end

tScapper = TweetScrapper.new
puts "What word to scrap:"
tScapper.displayYoutubeLinks(gets.strip)
