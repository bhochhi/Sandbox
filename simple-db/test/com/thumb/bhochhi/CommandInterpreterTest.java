package com.thumb.bhochhi;

import org.junit.Test;

import static org.junit.Assert.*;

public class CommandInterpreterTest {
	private QueryInterpreter ci;
	private String result;

	@Test
	public void testGetQuery() {
		ci = new QueryInterpreter();
		ci.execute("Set b 10");
		ci.execute("Set b 20");
		result = ci.execute("get a");
		assertEquals(null, result);
		result = ci.execute("get b");
		assertEquals("20", result);
	}

	@Test
	public void testSetQuery() {
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		ci.execute("Set b 20");
		result = ci.execute("get a");
		assertEquals("10", result);
		result = ci.execute("get b");
		assertEquals("20", result);
	}

	@Test
	public void testNumEqualToWithMultipleSet() {
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		result = ci.execute("numEqualto 10");
		assertEquals("2", result);
	}

	@Test
	public void testNumEqualToWithMultipleSetOnSameVariableAndValue() {

		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		ci.execute("Set b 10");
		ci.execute("Set a 10");
		result = ci.execute("numEqualto 10");
		assertEquals("2", result);

	}

	@Test
	public void testNumEqualToWithMultipleSetOnSameVariableAndValueWithUnset() {
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
	public void testRollbackQuery() {
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 10");
		result = ci.execute("rollback");
		assertEquals("NO TRANSACTION", result);
		ci.execute("begin");
		ci.execute("set a 5");
		ci.execute("rollback");
		result = ci.execute("get a");
		assertEquals("10", result);
	}

	@Test
	public void testCommitQuery() {
		ci = new QueryInterpreter();
		ci.execute("Set a 10");
		ci.execute("Set b 20");
		ci.execute("begin");
		ci.execute("set b 2");
		ci.execute("commit");
		result = ci.execute("get b");
		assertEquals("2", result);

		result = ci.execute("rollback");
		assertEquals("NO TRANSACTION", result);

		ci.execute("Set a 3");
		ci.execute("begin");
		ci.execute("set c 20");
		ci.execute("begin");
		ci.execute("set a 23");
		ci.execute("set c 2");
		ci.execute("set c 3");
		result = ci.execute("rollback");
		assertEquals("", result);
		result = ci.execute("get c");
		assertEquals("20", result);
		ci.execute("set x 20");
		result = ci.execute("commit");
		assertEquals("", result);

		result = ci.execute("get a");
		assertEquals("3", result);

		result = ci.execute("get c");
		assertEquals("20", result);

		result = ci.execute("numEqualto 20");
		assertEquals("3", result);
		
		
		result = ci.execute("commit");
		assertEquals("NO TRANSACTION", result);

		result = ci.execute("rollback");
		assertEquals("NO TRANSACTION", result);
	}
}
