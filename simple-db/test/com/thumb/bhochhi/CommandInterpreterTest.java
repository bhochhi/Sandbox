package com.thumb.bhochhi;

import org.junit.Test;

import static org.junit.Assert.*;

public class CommandInterpreterTest {

	@Test
	public void testNumEqualTo() throws Exception {
		CommandInterpreter ci = new CommandInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		String result = ci.execute("numEqualto 10");
		assertEquals("2", result);		
	}
}
