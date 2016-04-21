package com.thumb.bhochhi;

import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		QueryInterpreter commandInterpreter = new QueryInterpreter();
		try (Scanner sc = new Scanner(System.in)) {
			while (true) {
				String commandLine = sc.nextLine();
				String result = commandInterpreter.execute(commandLine);
				if(result!=null && result.equals("END")){
					break;
				}
				else if(result == null || !result.equals("")){
					System.out.println(result);	
				}
				
			}
		} 

	}
}
