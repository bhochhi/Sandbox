package com.thumb.bhochhi;

import org.junit.Test;

import static org.junit.Assert.*;

public class CommandInterpreterTest {
	CommandInterpreter ci;
	private void given() {
		ci = new CommandInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
	}
	@Test
	public void testNumEqualTo() {
		given();
		String result = ci.execute("numEqualto 10");
		assertEquals("2", result);	
	}
}
