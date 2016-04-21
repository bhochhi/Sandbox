package com.thumb.bhochhi;

import org.junit.Test;

import static org.junit.Assert.*;

public class CommandInterpreterTest {
	private QueryInterpreter ci;
	private String result;
	@Test
	public void testNumEqualToWithMultipleSet() {
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		result = ci.execute("numEqualto 10");
		assertEquals("2", result);
	}
	
	@Test
	public void testNumEqualToWithMultipleSetOnSameVariableAndValue(){
	
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		ci.execute("Set b 10");
		ci.execute("Set a 10");
		result = ci.execute("numEqualto 10");
		assertEquals("2", result);
		
	}
	
	@Test
	public void testNumEqualToWithMultipleSetOnSameVariableAndValueWithUnset(){
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		ci.execute("Set b 10");
		ci.execute("unset b");
		result = ci.execute("numEqualto 10");
		assertEquals("1", result);
	
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		ci.execute("Set b 10");
		ci.execute("unset a");
		result = ci.execute("numEqualto 10");
		assertEquals("1", result);
			
	}
	
	@Test
	public void testTransactionQuery(){
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		ci.execute("begin");
		ci.execute("set a 5");
		ci.execute("rollback");
		result = ci.execute("get a");
		assertEquals("10",result);
	}
}
