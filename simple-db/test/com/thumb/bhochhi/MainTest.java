package com.thumb.bhochhi;

import org.junit.Test;

public class MainTest {

	
	@Test
	public void testExecutionWithFile(){
		Main app = new Main();
		String[] agrs ={"../input.txt"};
		app.main(agrs);
	}
}
