<?php

namespace server\interfaces;

interface ASModelInterface {
	public function join(string $joinType = 'JOIN', string $alias = '', $tableName, Array $joinArray);
	public function create(Array $updateArray = []);
	public function update(Array $updateArray = []);
	public function delete(Array $updateArray = []);
	public function select(Array $updateArray = []);
}