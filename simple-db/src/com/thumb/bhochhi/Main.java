package com.thumb.bhochhi;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.Scanner;
import java.util.stream.Stream;

public class Main {

	public static void main(String[] args) {

		QueryInterpreter commandInterpreter = new QueryInterpreter();
		if (args.length > 0) {		
			try (Stream<String> stream = Files.lines(Paths.get(args[0]))) {
				Iterator<String> itr = stream.iterator();
				while(itr.hasNext()){
					String command = itr.next();
					String result = commandInterpreter.execute(command);
					if (result != null && result.equals("END")) {
						break;
					} else if (result == null || !result.equals("")) {
						System.out.println(result);
					}
				}
			} catch (IOException e) {
				e.printStackTrace();
			}

		} else {
			try (Scanner sc = new Scanner(System.in)) {
				while (true) {
					String commandLine = sc.nextLine();
					String result = commandInterpreter.execute(commandLine);
					if (result != null && result.equals("END")) {
						break;
					} else if (result == null || !result.equals("")) {
						System.out.println(result);
					}

				}
			}
		}

	}
}
