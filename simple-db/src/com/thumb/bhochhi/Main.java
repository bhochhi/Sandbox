package com.thumb.bhochhi;

import java.util.Scanner;

public class Main {

	public static void main(String[] args) {

		CommandInterpreter commandInterpreter = new CommandInterpreter();
		try (Scanner sc = new Scanner(System.in)) {
			while (true) {
				String commandLine = sc.nextLine();
				System.out.println(commandInterpreter.execute(commandLine));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
